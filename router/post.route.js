const express = require('express')
const router = express.Router()

const {authMiddleware} = require('../middleware/authUserMiddleware')
const {newsFeedPost, getAllPost} = require('../controllers/postController')

router.post('/create', authMiddleware, newsFeedPost)
// router.get('/', authMiddleware, getAllPost) // remove for now

// router.get('/', authMiddleware, getAllPost)

module.exports = router