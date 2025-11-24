const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const { authMiddleware } = require("../middleware/authUserMiddleware");
const { updateProfile } = require("../controllers/updateProfileControllers");

router.use(fileUpload({ useTempFiles: true }));

router.put("/update", authMiddleware, updateProfile);

module.exports = router;
