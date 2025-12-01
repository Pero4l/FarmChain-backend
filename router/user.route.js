const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/userController');
const { getAllUsers, getUserById, followUser, getUserProfile } = require('../controllers/userProfileController');
const { loginMiddleware } = require('../middleware/loginMiddleware');
const { authMiddleware } = require('../middleware/authUserMiddleware');
const {getNotification, deleteNotification} = require("../controllers/notificationController")

// Auth routes
router.post('/register', register);
router.post('/login', loginMiddleware, login);

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
