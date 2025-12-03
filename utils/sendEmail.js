async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await user.update({
      otpCode: otp,
      otpExpiresAt: expires,
    });

    // ---- SEND OTP EMAIL HERE ----
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
