import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Tutor Finder" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent ✅");
  } catch (error) {
    console.error("Email error:", error);
  }
};

export default sendEmail;