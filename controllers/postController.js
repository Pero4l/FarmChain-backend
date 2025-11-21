const { Posts, Users, Notifications, Profile } = require("../models");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to Cloudinary
function uploadToCloudinary(fileBuffer, folder, resourceType = "image") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: uuidv4(),
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}

// Controller
async function newsFeedPost(req, res) {
  try {
    const { content, farmSize, tags, category } = req.body;

    // User info
    const user = req.user;
    const user_id = user.userId;
    const farmer = user.currentUser;
    const location = user.location;

    const profile = await Profile.findOne({
      attributes: ["avatar", "verified"],
      where: { user_id },
    });

    const avatar = profile?.avatar || null;
    const verified = profile?.verified || false;

    // Get files from multer.fields
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    // Validation
    if (images.length && !videos.length && images.length > 10)
      return res.status(400).json({ success: false, message: "Max 10 images allowed" });

    if (videos.length && !images.length && videos.length > 4)
      return res.status(400).json({ success: false, message: "Max 4 videos allowed" });

    if (images.length && videos.length && (images.length > 4 || videos.length > 2))
      return res.status(400).json({
        success: false,
        message: "When uploading both, max is 4 images + 2 videos",
      });

    // Upload media to Cloudinary
    const [uploadedImages, uploadedVideos] = await Promise.all([
      Promise.all(images.map((img) => uploadToCloudinary(img.buffer, "posts/images", "image"))),
      Promise.all(videos.map((vid) => uploadToCloudinary(vid.buffer, "posts/videos", "video"))),
    ]);

    // Create post
    const newPost = await Posts.create({
      user_id,
      farmer,
      location,
      avatar,
      verified,
      farmSize,
      content,
      images: uploadedImages.map((i) => i.secure_url),
      videos: uploadedVideos.map((v) => v.secure_url),
      likes: 0,
      comments: 0,
      shares: 0,
      tags: tags ? tags.split(/[, ]+/).filter(Boolean) : [],
      category: category || "general",
    });

    // Optional notification
    const isUser = await Users.findOne({ where: { id: user_id } });
    if (isUser) {
      await Notifications.create({
        user_id: isUser.id,
        notification: "Post created successfully",
      });
    }

    res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Unable to create post" });
  }
}

module.exports = { newsFeedPost };
