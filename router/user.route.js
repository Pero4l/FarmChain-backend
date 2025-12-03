const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/userController');
const { getAllUsers, getUserById, followUser, getUserProfile } = require('../controllers/userProfileController');
const { loginMiddleware } = require('../middleware/loginMiddleware');
const { authMiddleware } = require('../middleware/authUserMiddleware');
const {getNotification, deleteNotification} = require("../controllers/notificationController")
const {forgotPassword, verifyOTP, resetPassword } = require("../controllers/forgettonPasswordController");

// Auth routes
router.post('/register', register);
router.post('/login', loginMiddleware, login);



// Forgot password – sends OTP
router.post("/forgot-password", forgotPassword);
// Verify OTP
router.post("/verify-otp", verifyOTP);
// Reset password
router.post("/reset-password", resetPassword);




// Follow / Unfollow route
router.post('/follow', authMiddleware, followUser);

// User Notification
router.get('/notification', authMiddleware, getNotification)

// User routes
router.get('/all', authMiddleware, getAllUsers);
router.get('/profile', authMiddleware, getUserProfile)
router.delete('/notification/:id', authMiddleware, deleteNotification)
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
