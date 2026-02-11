import {
  sendVerifyOtp_template,
  sendResetPassOtp_template,
} from "../config/emailTemplate.js";

const sendEmail = async ({ to, subject, type, otp, name, email }) => {
  const emailTemplates = {
    welcome: {
      subject: "Welcome to Auth System!",
      html: `<h1>Hello ${name}!</h1><p>Thank you for registering, your account has been created with email id: ${email}.</p>`,
    },
    verification: {
      subject: "Account Verification OTP",
      // html: `<h1>Your Verification OTP</h1><p>Use this code to verify your account: <b>${otp}</b></p>`,
      html: sendVerifyOtp_template
        .replace("{{otp}}", otp)
        .replace("{{email}}", email),
    },
    resetPassword: {
      subject: "Password Reset OTP",
      // html: `<h1>Reset Your Password</h1><p>Use this OTP to reset your password: <b>${otp}</b></p>`,
      html: sendResetPassOtp_template
        .replace("{{otp}}", otp)
        .replace("{{email}}", email),
    },
  };

  const { subject: defaultSubject, html } = emailTemplates[type];

  try {
    const response = await fetch(process.env.BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Auth system", email: process.env.SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject || defaultSubject,
        htmlContent: html,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Brevo API Error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
