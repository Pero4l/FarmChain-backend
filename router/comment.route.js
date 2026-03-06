const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authUserMiddleware");
const { addComment, getPostComments, deleteComment } = require("../controllers/commentController");

router.post("/add", authMiddleware, addComment);
router.get("/:postId", authMiddleware, getPostComments);
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
