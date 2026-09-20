const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not configured.");
}

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, term_level, password } = req.body;

    if(
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
      ){
      return res.status(400).json({
        error:"Password must contain at least 8 characters, a letter, number and special character."
      });
    }

    if (!name || !email || !term_level || !password) {
      return res.status(400).json({
        error: "Name, email, term level, and password are required.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    if(!cleanEmail.endsWith("@student.ksu.edu.sa")){
      return res.status(400).json({
        error:"Only university email allowed"
      });
    }

    name = validator.escape(
      String(name).trim()
    );

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered.",
      });
    }

    const newUser = await User.create({
      name: validator.escape( String(name).trim()),
      email: String(email).trim().toLowerCase(),
      role: "student",
      term_level: String(term_level).trim(),
      password,
    });

    res.status(201).json({
      message:
        "Registration successful. Your account is pending admin approval.",
      userId: newUser.id,
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
    res.status(500).json({
      error: "Server error during registration.",
    });
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
