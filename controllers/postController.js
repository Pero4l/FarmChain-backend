const { Post } = require("../models");
const { Users } = require("../models");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// ---- Cloudinary Config ----
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---- Multer Config ----
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 5 },
]);

// ---- Helper: Upload to Cloudinary ----
function uploadToCloudinary(fileBuffer, folder, resourceType = "image") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: `${folder}/${uuidv4()}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

// ---- Controller ----
async function newsFeedPost(req, res) {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const {
        avatar,
        verified,
        farmSize,
        content,
        tags,
        category,
      } = req.body;

      const user = req.user

      const user_id = user.userId
      const farmer = user.currentUser
      const location = user.location

      if (!content) {
        return res.status(400).json({ success: false, message: "Content is required" });
      }

      const files = req.files || {};
      const images = files.images || [];
      const videos = files.video || [];

      // ---- Upload images and videos concurrently ----
      const uploadedImages = await Promise.all(
        images.map((img) => uploadToCloudinary(img.buffer, "posts/images", "image"))
      );
      const uploadedVideos = await Promise.all(
        videos.map((vid) => uploadToCloudinary(vid.buffer, "posts/videos", "video"))
      );

      // ---- Create Post Record ----
      const newPost = await Post.create({
        user_id,
        farmer,
        location,
        avatar,
        verified: verified === "true" || verified === true,
        farmSize,
        content,
        images: uploadedImages.map((img) => img.secure_url),
        video: uploadedVideos.map((vid) => vid.secure_url),
        likes: 0,
        comments: 0,
        shares: 0,
        tags: tags ? tags.split(" ").filter(Boolean) : [],
        category: category || "general",
      });

          // HANDLE NOTIFICATION
    const isUser = await Users.findOne({ where: id=user_id});
    if (isUser) {

      await Notifications.create({
        user_id: isUser.id,
        notification: 'Post created successfully'
      })
      
    }


      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ success: false, message: "Internal server error", error });
    }
  });
}

module.exports = { newsFeedPost };
