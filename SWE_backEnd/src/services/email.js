const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    const error = new Error("Email service is not configured.");
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return transporter;
};

const sendVerificationCode = async ({ email, code }) => {
  await getTransporter().sendMail({
    from: `SWE KSU <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "رمز التحقق لحساب SWE KSU",
    text: `رمز التحقق الخاص بك هو: ${code}. تنتهي صلاحيته خلال 10 دقائق. لا تشاركه مع أي شخص.`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.7">
        <h2>تأكيد البريد الإلكتروني</h2>
        <p>رمز التحقق الخاص بك هو:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 8px">${code}</p>
        <p>ينتهي الرمز خلال 10 دقائق. لا تشاركه مع أي شخص.</p>
      </div>`,
  });
};

module.exports = { sendVerificationCode };
