const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authUserMiddleware");
const { newsFeedPost } = require("../controllers/postController");
const multer = require("multer");

// Multer memory storage
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
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 4 },
]);

// Routes
router.post("/create", authMiddleware, upload, newsFeedPost);

module.exports = router;
