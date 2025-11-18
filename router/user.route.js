const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/userController');
const { getAllUsers, getUserById, followUser } = require('../controllers/userProfileController');
const { loginMiddleware } = require('../middleware/loginMiddleware');
const { authMiddleware } = require('../middleware/authUserMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', loginMiddleware, login);

// Follow / Unfollow route
router.post('/follow', authMiddleware, followUser);

// User routes
router.get('/all', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
