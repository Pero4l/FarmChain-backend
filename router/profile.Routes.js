const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const { authMiddleware } = require("../middleware/authUserMiddleware");
const { updateProfile } = require("../controllers/updateProfileControllers");

// Better file upload setup
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    abortOnLimit: true,
  })
);

router.put("/update", authMiddleware, updateProfile);

module.exports = router;
