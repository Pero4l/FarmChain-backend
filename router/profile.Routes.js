const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const auth = require("../middleware/authUserMiddleware");
const { updateProfile } = require("../controllers/updateProfileControllers");

router.use(fileUpload({ useTempFiles: true }));

router.put("/update", auth, updateProfile);

module.exports = router;
