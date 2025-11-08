const { Post, Users, Notifications } = require("../models");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
}).any();


// Helper: upload to Cloudinary
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
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { avatar, verified, farmSize, content, tags, category } = req.body;
      const user = req.user;
      const user_id = user.userId;
      const farmer = user.currentUser;
      const location = user.location;

      if (!content) {
        return res.status(400).json({ success: false, message: "Content is required" });
      }

      const files = req.files || [];
      const images = files.filter((f) => f.mimetype.startsWith("image/"));
      const videos = files.filter((f) => f.mimetype.startsWith("video/"));

      // --- Validate upload rules ---
      if (images.length && !videos.length && images.length > 10) {
        return res.status(400).json({ success: false, message: "You can upload up to 10 images only" });
      }

      if (videos.length && !images.length && videos.length > 4) {
        return res.status(400).json({ success: false, message: "You can upload up to 4 videos only" });
      }

      if (images.length && videos.length) {
        if (images.length > 4 || videos.length > 2) {
          return res.status(400).json({
            success: false,
            message: "When uploading both, max is 4 images and 2 videos",
          });
        }
      }

      // ---- Upload to Cloudinary ----
      const [uploadedImages, uploadedVideos] = await Promise.all([
        Promise.all(images.map((img) => uploadToCloudinary(img.buffer, "posts/images", "image"))),
        Promise.all(videos.map((vid) => uploadToCloudinary(vid.buffer, "posts/videos", "video"))),
      ]);

      // ---- Create Post Record ----
      const newPost = await Post.create({
        user_id,
        farmer,
        location,
        avatar,
        verified: verified === "true" || verified === true,
        farmSize,
        content,
        images: uploadedImages.map((i) => i.secure_url),
        video: uploadedVideos.map((v) => v.secure_url),
        likes: 0,
        comments: 0,
        shares: 0,
        tags: tags ? tags.split(" ").filter(Boolean) : [],
        category: category || "general",
      });

      // ---- Optional: Notification ----
      const isUser = await Users.findOne({ where: { id: user_id } });
      if (isUser) {
        await Notifications.create({
          user_id: isUser.id,
          notification: "Post created successfully",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ success: false, message: "Unable to create post" });
    }
  });
}

module.exports = { newsFeedPost };
