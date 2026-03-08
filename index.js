const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http"); // 🔹 you missed this

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

// Routes
const userAuth = require("./router/user.route");
const post = require("./router/post.route");
const ai = require("./router/ai.route");
const updatedProfile = require("./router/profile.Routes");
const chatRoutes = require("./router/chat.routes");
const commentRoutes = require("./router/comment.route.js");

// Database
const db = require("./config/db");

// Base route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to Farm chain" });
});

// Route middlewares
app.use("/auth", userAuth);
app.use("/post", post);
app.use("/user", userAuth);
app.use("/ai", ai);
app.use("/profile", updatedProfile);
app.use("/chat", chatRoutes);
app.use("/post/comment", commentRoutes);

// 🔹 Create HTTP server for Socket.IO
const server = http.createServer(app);

// 🔹 Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
require("./socket")(io); // pass io to your socket file


// Start server after DB sync
const PORT = process.env.PORT || 3001;

db.sync({ force: false, alter: false })
  .then(() => {
    server.listen(PORT, () => { // 🔹 use server.listen, not app.listen
      console.log(
        `✅ Database connected and Server running on PORT: ${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`❌ Database connection failed:`, e);
  });
