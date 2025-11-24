const { Profile } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // ================= UPLOAD AVATAR =================
    if (req.files?.avatar) {
      if (!ALLOWED_TYPES.includes(req.files.avatar.mimetype)) {
        return res.status(400).json({
          message: "Invalid avatar format. Allowed: JPG, PNG, WEBP",
        });
      }

      const uploadedAvatar = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        { folder: "profile_avatars", resource_type: "image" }
      );
      profile.avatar = uploadedAvatar.secure_url;
    }

    // ================= UPLOAD COVER =================
    if (req.files?.cover_avatar) {
      if (!ALLOWED_TYPES.includes(req.files.cover_avatar.mimetype)) {
        return res.status(400).json({
          message: "Invalid cover format. Allowed: JPG, PNG, WEBP",
        });
      }

      const uploadedCover = await cloudinary.uploader.upload(
        req.files.cover_avatar.tempFilePath,
        { folder: "profile_covers", resource_type: "image" }
      );
      profile.cover_avatar = uploadedCover.secure_url;
    }

    // ================= UPDATE TEXT FIELDS =================
    if (req.body.bio !== undefined) profile.bio = req.body.bio;
    if (req.body.organization !== undefined) profile.organization = req.body.organization;

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      updatedProfile: profile,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("File size limit")) {
      return res.status(400).json({ message: "File too large. Max 5 MB." });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateProfile };
