// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendOTPEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be APP PASSWORD
      },
    });

    const mailOptions = {
      from: `"FarmChain Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your FarmChain OTP Code",
      html: `
        <h2>FarmChain OTP Verification</h2>
        <p>Your 4-digit OTP code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 6px;">${otp}</h1>
        <p>This code expires in <b>5 minutes</b>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (err) {
    console.error("SEND OTP ERROR CODE:", err.code);
    console.error("SEND OTP FULL ERROR:", err);
    throw err;
  }
}

module.exports = { sendOTPEmail };

// require("dotenv").config();
// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendOTPEmail(email, otp) {
//   try {
//     await resend.emails.send({
//       from: "FarmChain <farmchaininfo@gmail.com>",
//       to: email,
//       subject: "Your FarmChain OTP Code",
//       html: `
//         <h2>FarmChain OTP Verification</h2>
//         <p>Your 4-digit OTP is:</p>
//         <h1 style="font-size: 32px; letter-spacing: 6px;">${otp}</h1>
//         <p>This code expires in <b>5 minutes</b>.</p>
//       `,
//     });

//     console.log("OTP sent successfully using Resend");
//   } catch (error) {
//     console.error("RESEND ERROR:", error);
//     throw error;
//   }
// }

// module.exports = { sendOTPEmail };
