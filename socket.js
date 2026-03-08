const { Message } = require("./models");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a conversation room
    socket.on("join_chat", (conversationId) => {
      socket.join(`chat_${conversationId}`);
    });

    // Send message (Broadcasting only, assuming already saved via REST)
    socket.on("send_message", async (data) => {
      const { conversationId, senderId, content, id, createdAt, user } = data;

      if (!content && !data.message) return;

      // Broadcast to all users in this conversation room
      io.to(`chat_${conversationId}`).emit("receive_message", {
        id: id,
        conversation_id: conversationId,
        sender_id: senderId,
        content: content || data.message,
        createdAt: createdAt || new Date(),
        User: user
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
