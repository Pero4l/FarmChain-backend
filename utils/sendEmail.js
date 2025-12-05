// utils/sendEmail.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// async function sendOTPEmail(email, otp) {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // Must be APP PASSWORD
//       },
//     });

//     const mailOptions = {
//       from: `"FarmChain Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your FarmChain OTP Code",
//       html: `
//         <h2>FarmChain OTP Verification</h2>
//         <p>Your 4-digit OTP code is:</p>
//         <h1 style="font-size: 32px; letter-spacing: 6px;">${otp}</h1>
//         <p>This code expires in <b>5 minutes</b>.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("OTP sent successfully");
//   } catch (err) {
//     console.error("SEND OTP ERROR CODE:", err.code);
//     console.error("SEND OTP FULL ERROR:", err);
//     throw err;
//   }
// }

// module.exports = { sendOTPEmail };

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



// utils/sendEmail.js
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOTPEmail(email, otp) {
  try {
    const msg = {
      to: email,
      from: {
        email: "farmchaininfo@gmail.com", // MUST be a verified sender
        name: "FarmChain Support"
      },
      subject: "Your FarmChain Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#2E7D32;">Verification code from FarmChain </h2>

          <p>Your OTP verification code is:</p>

          <h1 style="font-size: 36px; letter-spacing: 6px; color:#000;">${otp}</h1>

          <p>This code will expire in <b>5 minutes</b>.  
          Please do not share it with anyone.</p>

          <p>If you did not request this code, you can safely ignore this email.</p>

          <hr style="margin: 40px 0;" />

          <p style="font-size:12px; color:#777;">
            FarmChain<br />
            Jos, Nigeria<br />
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("SENDGRID ERROR:", error?.response?.body || error);
    throw error;
  }
}


module.exports = { sendOTPEmail };

