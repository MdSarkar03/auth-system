import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//to verify on render
transporter.verify((err, success) => {
  if (err) console.error("SMTP connection failed:", err);
  else console.log("SMTP connected:", success);
});

export default transporter;
