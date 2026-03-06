const { Message } = require("./models");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a conversation room
    socket.on("join_chat", (conversationId) => {
      socket.join(`chat_${conversationId}`);
    });

    // Send message
    socket.on("send_message", async (data) => {
      const { conversationId, senderId, content } = data;

      if (!content) return;

      // Save to database
      const message = await Message.create({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      });

      // Broadcast to all users in this conversation room
      io.to(`chat_${conversationId}`).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
