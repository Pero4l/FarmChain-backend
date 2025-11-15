const express = require('express')
const router = express.Router()

const{register, login} = require('../controllers/userController')
const { getAllUsers, getUserById } = require('../controllers/userProfileController')
const{loginMiddleware} = require('../middleware/loginMiddleware')
const { authMiddleware } = require('../middleware/authUserMiddleware')



router.post('/register', register)
router.post('/login', loginMiddleware, login )
router.get('/all', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware ,getUserById);

module.exports = router
