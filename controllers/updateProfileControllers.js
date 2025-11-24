const { Profile } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


 const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let avatarUrl = null;
    let coverUrl = null;

    // upload avatar
    if (req.files?.avatar) {
      const uploadAvatar = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        { folder: "profile_avatars" }
      );
      avatarUrl = uploadAvatar.secure_url;
    }

    // upload cover photo
    if (req.files?.cover_avatar) {
      const uploadCover = await cloudinary.uploader.upload(
        req.files.cover_avatar.tempFilePath,
        { folder: "profile_covers" }
      );
      coverUrl = uploadCover.secure_url;
    }

    // fetch profile
    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // update fields
    profile.bio = req.body.bio;
    profile.organization = req.body.organization;

    if (avatarUrl) profile.avatar = avatarUrl;
    if (coverUrl) profile.cover_avatar = coverUrl;

    await profile.save();

    res.json({
      message: "Profile updated successfully",
      updatedProfile: profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { updateProfile };