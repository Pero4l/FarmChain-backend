const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: '*' })); 
app.use(express.urlencoded({ extended: true }));


const userAuth = require("./router/user.route");
const post = require("./router/post.route");
const ai = require("./router/ai.route")
const updatedProfile = require("./router/profile.Routes");


const db = require("./config/db");

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wecome to Farm chain",
  });
});

app.use("/auth", userAuth);
app.use("/post", post);
app.use("/user", userAuth);
app.use("/ai", ai);
app.use("/profile", updatedProfile);

const PORT = process.env.PORT || 3001;

db.sync({ force: false, alter: false })
  .then(async () => {
    
    app.listen(PORT, () => {
      console.log(
        `✅ Database connected successfully and Server running on PORT:${PORT}`
      );
    });
  })
  .catch((e) => {
    console.log(`❌ Database connection failed:`, e);
  });
  