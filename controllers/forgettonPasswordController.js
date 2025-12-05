const { Users } = require('../models');
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../utils/sendEmail"); 

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();



// POST /auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user OTP fields correctly
    // await user.update({
    //   otpCode: otp,
    //   otpExpiresAt: expires,
    // });

  
    user.otpCode = otp;
    user.otpExpiresAt = expires;
    await user.save();

    // Send email
    await sendOTPEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}



// POST /auth/verify-otp
async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otpCode || !user.otpExpiresAt)
      return res.status(400).json({ success: false, message: "No OTP found" });

    if (new Date() > user.otpExpiresAt)
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (otp !== user.otpCode)
      return res.status(401).json({ success: false, message: "Invalid OTP" });

    res.json({
      success: true,
      message: "OTP verified, you can now set a new password",
    });
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}



// POST /auth/reset-password
async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed,
      otpCode: null,
      otpExpiresAt: null,
    });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log("RESET PASSWORD ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}



module.exports = { resetPassword, verifyOTP, forgotPassword };
