const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getOrCreateConversation, getUserConversations } = require("../controllers/chatController");

const { authMiddleware } = require("../middleware/authUserMiddleware");

// Create or fetch private conversation
router.post("/conversation", authMiddleware, getOrCreateConversation);

// Get all conversations for logged-in user
router.get("/conversations", authMiddleware, getUserConversations);

// Fetch messages for a conversation
router.get("/messages/:conversationId", authMiddleware, getMessages);

// Send a message
router.post("/message", authMiddleware, sendMessage);

module.exports = router;
