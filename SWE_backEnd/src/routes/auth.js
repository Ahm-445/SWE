const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const validator = require("validator");
const { sendVerificationCode } = require("../services/email");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
// This data is intentionally in memory: it is never a User record until OTP succeeds.
const registrationAttempts = new Map();
const passwordResetAttempts = new Map();

if (!JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not configured.");
}

const cleanExpiredAttempts = () => {
  const now = Date.now();
  for (const [id, attempt] of registrationAttempts) {
    if (attempt.expiresAt <= now) registrationAttempts.delete(id);
  }
  for (const [id, attempt] of passwordResetAttempts) {
    if (attempt.expiresAt <= now) passwordResetAttempts.delete(id);
  }
};

const hashOtp = (code) => crypto
  .createHmac("sha256", process.env.OTP_HASH_SECRET || JWT_SECRET || "development-only-secret")
  .update(code)
  .digest("hex");

const createOtp = () => crypto.randomInt(100000, 1000000).toString();

const validateRegistration = async ({ name, email, term_level, password }) => {
  if (!name || !email || !term_level || !password) {
    return { error: "Name, email, term level, and password are required." };
  }

  if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return { error: "Password must contain at least 8 characters, a letter, number and special character." };
  }

  const cleanEmail = String(email).trim().toLowerCase();
  if (!/^\d{9}@student\.ksu\.edu\.sa$/.test(cleanEmail)) {
    return { error: "Only valid university email allowed" };
  }

  const existingUser = await User.findOne({ where: { email: cleanEmail } });
  if (existingUser) return { error: "Email already registered." };

  return {
    data: {
      name: validator.escape(String(name).trim()),
      email: cleanEmail,
      term_level: String(term_level).trim(),
      passwordHash: await bcrypt.hash(password, 10),
    },
  };
};

const sendCodeForAttempt = async (attempt) => {
  const code = createOtp();
  attempt.otpHash = hashOtp(code);
  attempt.expiresAt = Date.now() + OTP_TTL_MS;
  attempt.resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
  attempt.attempts = 0;
  await sendVerificationCode({ email: attempt.data.email, code });
};

// Starts a registration, but does NOT create a user in the database.
router.post("/register", async (req, res) => {
  try {
    const { name, email, term_level, password } = req.body;
    const result = await validateRegistration({ name, email, term_level, password });
    if (result.error) return res.status(400).json({ error: result.error });

    cleanExpiredAttempts();
    const registrationId = crypto.randomUUID();
    const attempt = { data: result.data };
    await sendCodeForAttempt(attempt);
    registrationAttempts.set(registrationId, attempt);

    res.status(201).json({
      message: "Verification code sent.",
      registrationId,
      resendAvailableIn: 60,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: error.errors[0].message,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Email already registered.",
      });
    }

    console.error("Register error:", error);
    res.status(error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500).json({
      error: error.code === "EMAIL_NOT_CONFIGURED" ? "Email service is not configured." : "Could not send verification code.",
    });
  }
});

router.post("/register/resend", async (req, res) => {
  try {
    cleanExpiredAttempts();
    const attempt = registrationAttempts.get(req.body.registrationId);
    if (!attempt) return res.status(410).json({ error: "Registration session expired. Please register again." });

    const remainingMs = attempt.resendAvailableAt - Date.now();
    if (remainingMs > 0) {
      return res.status(429).json({ error: "Please wait before requesting another code.", resendAvailableIn: Math.ceil(remainingMs / 1000) });
    }

    await sendCodeForAttempt(attempt);
    res.json({ message: "A new verification code was sent.", resendAvailableIn: 60 });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500).json({ error: "Could not resend verification code." });
  }
});

router.post("/register/verify", async (req, res) => {
  try {
    cleanExpiredAttempts();
    const { registrationId, code } = req.body;
    const attempt = registrationAttempts.get(registrationId);
    if (!attempt) return res.status(410).json({ error: "Registration session expired. Please register again." });

    if (!/^\d{6}$/.test(String(code || ""))) {
      return res.status(400).json({ error: "Enter the six-digit verification code." });
    }
    if (++attempt.attempts > MAX_OTP_ATTEMPTS) {
      registrationAttempts.delete(registrationId);
      return res.status(429).json({ error: "Too many incorrect attempts. Please register again." });
    }
    if (!crypto.timingSafeEqual(Buffer.from(attempt.otpHash), Buffer.from(hashOtp(String(code))))) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    const user = await User.create({
      name: attempt.data.name,
      email: attempt.data.email,
      role: "student",
      state: "active",
      term_level: attempt.data.term_level,
      password: attempt.data.passwordHash,
    });
    registrationAttempts.delete(registrationId);
    res.status(201).json({ message: "Email verified. You can now sign in.", userId: user.id });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email already registered." });
    }
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Could not verify registration." });
  }
});

// Explicit support fallback only: the user is saved as pending for an admin to review.
router.post("/register/request-manual-review", async (req, res) => {
  try {
    cleanExpiredAttempts();
    const attempt = registrationAttempts.get(req.body.registrationId);
    if (!attempt) return res.status(410).json({ error: "Registration session expired. Please register again." });
    const user = await User.create({
      name: attempt.data.name, email: attempt.data.email, role: "student", state: "pending",
      term_level: attempt.data.term_level, password: attempt.data.passwordHash,
    });
    registrationAttempts.delete(req.body.registrationId);
    res.status(201).json({ message: "Your request was sent to the administrator.", userId: user.id });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") return res.status(400).json({ error: "Email already registered." });
    console.error("Manual review registration error:", error);
    res.status(500).json({ error: "Could not submit manual review request." });
  }
});

const isValidPassword = (password) => (
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[!@#$%^&*]/.test(password)
);

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.state !== "active") {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }

    cleanExpiredAttempts();
    const resetId = crypto.randomUUID();
    const attempt = { data: { email }, userId: user.id };
    const code = createOtp();
    attempt.otpHash = hashOtp(code);
    attempt.expiresAt = Date.now() + OTP_TTL_MS;
    attempt.resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
    attempt.attempts = 0;
    await sendVerificationCode({
      email,
      code,
      subject: "رمز إعادة تعيين كلمة المرور - SWE KSU",
      heading: "إعادة تعيين كلمة المرور",
    });
    passwordResetAttempts.set(resetId, attempt);
    res.json({ message: "Password reset code sent.", resetId, resendAvailableIn: 60 });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500).json({ error: "Could not send password reset code." });
  }
});

router.post("/forgot-password/resend", async (req, res) => {
  try {
    cleanExpiredAttempts();
    const attempt = passwordResetAttempts.get(req.body.resetId);
    if (!attempt) return res.status(410).json({ error: "Password reset session expired. Please start again." });
    const remainingMs = attempt.resendAvailableAt - Date.now();
    if (remainingMs > 0) {
      return res.status(429).json({ error: "Please wait before requesting another code.", resendAvailableIn: Math.ceil(remainingMs / 1000) });
    }
    const code = createOtp();
    attempt.otpHash = hashOtp(code);
    attempt.expiresAt = Date.now() + OTP_TTL_MS;
    attempt.resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
    attempt.attempts = 0;
    await sendVerificationCode({
      email: attempt.data.email,
      code,
      subject: "رمز إعادة تعيين كلمة المرور - SWE KSU",
      heading: "إعادة تعيين كلمة المرور",
    });
    res.json({ message: "A new password reset code was sent.", resendAvailableIn: 60 });
  } catch (error) {
    console.error("Resend password reset error:", error);
    res.status(error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 500).json({ error: "Could not resend password reset code." });
  }
});

router.post("/forgot-password/verify", async (req, res) => {
  try {
    cleanExpiredAttempts();
    const { resetId, code, password } = req.body;
    const attempt = passwordResetAttempts.get(resetId);
    if (!attempt) return res.status(410).json({ error: "Password reset session expired. Please start again." });
    if (!/^\d{6}$/.test(String(code || ""))) {
      return res.status(400).json({ error: "Enter the six-digit verification code." });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Password must contain at least 8 characters, a letter, number and special character." });
    }
    if (++attempt.attempts > MAX_OTP_ATTEMPTS) {
      passwordResetAttempts.delete(resetId);
      return res.status(429).json({ error: "Too many incorrect attempts. Please start again." });
    }
    if (!crypto.timingSafeEqual(Buffer.from(attempt.otpHash), Buffer.from(hashOtp(String(code))))) {
      return res.status(400).json({ error: "Invalid verification code." });
    }
    const user = await User.findByPk(attempt.userId);
    if (!user || user.state !== "active") {
      passwordResetAttempts.delete(resetId);
      return res.status(404).json({ error: "User is no longer available for password reset." });
    }
    user.password = password;
    await user.save();
    passwordResetAttempts.delete(resetId);
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Verify password reset error:", error);
    res.status(500).json({ error: "Could not update password." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      where: {
        email: String(email).trim().toLowerCase(),
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    if (user.state === "pending") {
      return res.status(403).json({
        error: "Your account is still pending admin approval.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        term_level: user.term_level,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login.",
    });
  }
});

module.exports = router;
