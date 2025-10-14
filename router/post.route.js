const express = require('express')
const router = express.Router()

const {authMiddleware} = require('../middleware/authUserMiddleware')
const {newsFeedPost} = require('../controllers/postController')

router.post('/create', authMiddleware, newsFeedPost)