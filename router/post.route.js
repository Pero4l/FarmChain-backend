const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authUserMiddleware");
const { newsFeedPost, getAllPosts, deletePost, postLike } = require("../controllers/postController");
const multer = require("multer");

// MEMORY STORAGE — safest for Render/Vercel/etc
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos allowed"));
    }
  },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 4 },
]);

router.post(
  "/create",
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        console.log("Multer Error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  authMiddleware,
  newsFeedPost
);

router.get("/all", authMiddleware, getAllPosts);
router.delete("/delete", authMiddleware, deletePost);
router.post("/like", authMiddleware, postLike)

module.exports = router;
