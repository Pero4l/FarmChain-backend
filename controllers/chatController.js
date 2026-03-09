const { Conversation, ConversationMember, Message, Users, Profile, Sequelize } = require("../models");
const { Op } = Sequelize;

const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const otherUserId = req.body.otherUserId || req.body.receiverId;

    if (!otherUserId) return res.status(400).json({
      success: false,
      message: "Other user ID is required",
      receivedBody: req.body
    });

    if (userId === otherUserId) return res.status(400).json({
      success: false,
      message: "You cannot start a chat with yourself"
    });

    // Find existing conversation between these two users
    // We search for a conversation that has BOTH members
    const conversations = await Conversation.findAll({
      include: [{
        model: ConversationMember,
        where: { user_id: userId }
      }]
    });

    let existingConversation = null;

    for (const conv of conversations) {
      const otherMember = await ConversationMember.findOne({
        where: { conversation_id: conv.id, user_id: otherUserId }
      });
      if (otherMember) {
        existingConversation = conv;
        break;
      }
    }

    if (existingConversation) {
      // Return existing conversation with members
      const fullConversation = await Conversation.findByPk(existingConversation.id, {
        include: [
          {
            model: ConversationMember,
            include: [{
              model: Users,
              attributes: ["id", "first_name", "last_name"],
              include: [{ model: Profile, attributes: ["avatar", "verified"] }]
            }]
          }
        ]
      });
      return res.json({ success: true, ...fullConversation.toJSON() });
    }

    // Create new conversation
    const conversation = await Conversation.create();

    await ConversationMember.bulkCreate([
      { conversation_id: conversation.id, user_id: userId },
      { conversation_id: conversation.id, user_id: otherUserId },
    ]);

    const createdConversation = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: ConversationMember,
          include: [{
            model: Users,
            attributes: ["id", "first_name", "last_name"],
            include: [{ model: Profile, attributes: ["avatar", "verified"] }]
          }]
        }
      ]
    });

    res.status(201).json({ success: true, ...createdConversation.toJSON() });
  } catch (error) {
    console.error("[Chat Error]:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message
    });
  }
};


const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.findAll({
      include: [
        {
          model: ConversationMember,
          // We don't filter members here because we want to see ALL members (including the "other" person)
          include: [{
            model: Users,
            attributes: ["id", "first_name", "last_name"],
            include: [{ model: Profile, attributes: ["avatar", "verified"] }]
          }],
        },
      ],
      // But we only want conversations that the current user is part of
      where: Sequelize.literal(`EXISTS (
        SELECT 1 FROM conversation_members 
        WHERE conversation_members.conversation_id = Conversation.id 
        AND conversation_members.user_id = '${userId}'
      )`),
      order: [["createdAt", "DESC"]],
    });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      include: [{
        model: Users,
        attributes: ["id", "first_name", "last_name"],
        include: [{ model: Profile, attributes: ["avatar"] }]
      }],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const conversationId = req.body.conversationId || req.body.conversation_id;
    const receiverId = req.body.receiverId || req.body.receiver_id;
    const content = req.body.content || req.body.message;

    if (!content) return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
      receivedBody: req.body
    });

    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [{
        model: Users,
        attributes: ["id", "first_name", "last_name"],
        include: [{ model: Profile, attributes: ["avatar"] }]
      }]
    });

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { sendMessage, getMessages, getOrCreateConversation, getUserConversations }