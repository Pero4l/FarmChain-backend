const express = require('express')
const router = express.Router()

const{register, login} = require('../controllers/userController')
import { getAllUsers, getUserById } from '../controllers/userController'
const{loginMiddleware} = require('../middleware/loginMiddleware')



router.post('/register', register)
router.post('/login', loginMiddleware, login )
router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router
