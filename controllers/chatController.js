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
    const conversations = await Conversation.findAll({
      include: [{
        model: ConversationMember,
        as: 'ConversationMembers',
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
      const fullConversation = await Conversation.findByPk(existingConversation.id, {
        include: [
          {
            model: ConversationMember,
            as: 'ConversationMembers',
            include: [{
              model: Users,
              as: 'User',
              attributes: ["id", "first_name", "last_name"],
              include: [{ model: Profile, attributes: ["avatar", "verified"] }]
            }]
          }
        ]
      });
      return res.json({ success: true, data: fullConversation.toJSON() });
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
          as: 'ConversationMembers',
          include: [{
            model: Users,
            as: 'User',
            attributes: ["id", "first_name", "last_name"],
            include: [{ model: Profile, attributes: ["avatar", "verified"] }]
          }]
        }
      ]
    });

    res.status(201).json({ success: true, data: createdConversation.toJSON() });
  } catch (error) {
    console.error("[getOrCreateConversation Error]:", error);
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

    // Find all conversations where the current user is a member
    const userConversations = await ConversationMember.findAll({
      where: { user_id: userId },
      attributes: ['conversation_id']
    });

    const conversationIds = userConversations.map(uc => uc.conversation_id);

    if (conversationIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const conversations = await Conversation.findAll({
      where: { id: conversationIds },
      include: [
        {
          model: ConversationMember,
          as: 'ConversationMembers',
          include: [{
            model: Users,
            as: 'User',
            attributes: ["id", "first_name", "last_name"],
            include: [{ model: Profile, attributes: ["avatar", "verified"] }]
          }],
        },
        {
          model: Message,
          limit: 1,
          order: [["createdAt", "DESC"]],
          as: 'Messages'
        }
      ],
      order: [["updatedAt", "DESC"]],
    });

    // Format the response to match frontend expectations (participant, lastMessage)
    const formattedConversations = conversations.map(conv => {
      const convJson = conv.toJSON();
      // Find the "other" participant
      const otherMember = convJson.ConversationMembers.find(m => m.user_id !== userId);
      const participant = otherMember ? {
        id: otherMember.User.id,
        name: `${otherMember.User.first_name} ${otherMember.User.last_name}`,
        avatar: otherMember.User.Profile?.avatar,
        online: false
      } : null;

      return {
        id: convJson.id,
        participant,
        lastMessage: convJson.Messages && convJson.Messages.length > 0 ? {
          content: convJson.Messages[0].content,
          createdAt: convJson.Messages[0].createdAt
        } : null,
        updatedAt: convJson.updatedAt
      };
    });

    res.json({ success: true, data: formattedConversations });
  } catch (error) {
    console.error("[getUserConversations Error]:", error);
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};


const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      include: [{
        model: Users,
        as: 'User',
        attributes: ["id", "first_name", "last_name"],
        include: [{ model: Profile, attributes: ["avatar"] }]
      }],
      order: [["createdAt", "ASC"]],
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("[getMessages Error]:", error);
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};


const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    let conversationId = req.body.conversationId || req.body.conversation_id;
    const receiverId = req.body.receiverId || req.body.receiver_id;
    const content = req.body.content || req.body.message;

    if (!content) return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
      receivedBody: req.body
    });

    // If conversationId is missing, try to find or create one
    if (!conversationId && receiverId) {
      console.log(`[sendMessage] Missing conversationId, attempting to resolve for receiver: ${receiverId}`);

      // Find existing conversation
      const conversations = await Conversation.findAll({
        include: [{
          model: ConversationMember,
          as: 'ConversationMembers',
          where: { user_id: senderId }
        }]
      });

      for (const conv of conversations) {
        const otherMember = await ConversationMember.findOne({
          where: { conversation_id: conv.id, user_id: receiverId }
        });
        if (otherMember) {
          conversationId = conv.id;
          break;
        }
      }

      // If still no conversation, create one
      if (!conversationId) {
        const newConv = await Conversation.create();
        await ConversationMember.bulkCreate([
          { conversation_id: newConv.id, user_id: senderId },
          { conversation_id: newConv.id, user_id: receiverId },
        ]);
        conversationId = newConv.id;
      }
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID or Receiver ID is required"
      });
    }

    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    });

    // Update conversation's updatedAt to bubble it to the top
    await Conversation.update({ updatedAt: new Date() }, { where: { id: conversationId } });

    const fullMessage = await Message.findByPk(message.id, {
      include: [{
        model: Users,
        as: 'User',
        attributes: ["id", "first_name", "last_name"],
        include: [{ model: Profile, attributes: ["avatar"] }]
      }]
    });

    res.status(201).json({ success: true, data: fullMessage });
  } catch (error) {
    console.error("[sendMessage Error]:", error);
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};


module.exports = { sendMessage, getMessages, getOrCreateConversation, getUserConversations }