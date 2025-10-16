// controllers/posts.js

const { readDb, writeDb } = require('../utils/dbOperation');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { post } = require('../router/post.route');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

dayjs.extend(relativeTime);

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup: store in memory so we can upload to cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,  // e.g. 50MB max for each file (tweak as needed)
    files: 15                    // overall max fields; we'll enforce stricter rules later
  },
  fileFilter: (req, file, cb) => {
    // accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image or video files are allowed'), false);
    }
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);


// Controller function
async function newsFeedPost(req, res) {
  // handle multer parsing
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // validate text field
    await body('text').notEmpty().withMessage('Text is required').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, tags } = req.body;
    const files = req.files || {};  // multer populates this
    const images = files.images || [];
    const videos = files.videos || [];

    // Enforce media rules
    if (videos.length > 0 && images.length === 0) {
      // only videos
      if (videos.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'You can upload up to 5 videos only'
        });
      }
    } else if (images.length > 0 && videos.length === 0) {
      // only images
      if (images.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'You can upload up to 10 images only'
        });
      }
    } else if (images.length > 0 && videos.length > 0) {
      // both present
      const total = images.length + videos.length;
      if (total > 5) {
        return res.status(400).json({
          success: false,
          message: 'If posting both images and videos, total media files must be 5 or less'
        });
      }
    }

    // read existing posts
    const data = readDb();

    // check duplicate content
    const existPost = data.posts.find(p => p.content === text);
    if (existPost) {
      return res.status(400).json({
        success: false,
        message: 'Post already exists'
      });
    }

    const user = req.user;  // assuming you have middleware setting req.user

    // upload media to cloud
    const uploadedImages = [];
    const uploadedVideos = [];

    // process images
    for (let img of images) {
      const uniqueName = `posts/images/${uuidv4()}`;
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: 'posts/images',
          public_id: uniqueName,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      // but upload_stream uses callback; better wrap in promise
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'posts/images',
            public_id: uniqueName,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(img.buffer);
      });

      uploadedImages.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
    }

    // process videos similarly
    for (let vid of videos) {
      const uniqueName = `posts/videos/${uuidv4()}`;
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'posts/videos',
            public_id: uniqueName,
            resource_type: 'video'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(vid.buffer);
      });

      uploadedVideos.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
    }

    // Build new post
    const newId = data.posts.length + 1;
    const userId = user.userId;
    const farmer = user.currentUser;
    const location = user.location;
    const avatar = user.userId; 
    const postAt = new Date().toISOString();
    const time = dayjs(postAt).fromNow();
    const verified = user.verified;
    const content = text;
    const tagArray = tags.split(" ").filter(Boolean);

    const newPost = {
      id: newId,
      userId,
      farmer,
      location,
      avatar,
      postAt,
      time,
      verified,
      content,
      images: uploadedImages,   // array of { url, public_id }
      videos: uploadedVideos,   // array of { url, public_id }
      likes: 0,
      comments: 0,
      shares: 0,
      tags: tagArray,
      category: user.category || 'general'
    };

    // save
    data.posts.push(newPost);
  const userCheck = data['users'].find((u)=> u.id === userId)
  userCheck.notifications.push({notification:`Post created successfully`})
    writeDb(data);

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
    
  });




}



async function getAllPost(req, res) {
  const data = readDb()

  const allPosts = data['posts']

  try{
    res.status(200).json({
      "sucess": true,
      "message": "Gotten all posts sucessfully",
      "posts": allPosts
    })
  } catch (err){
    console.log("Error getting posts", err);
  }
  
}


async function updatePost(req, res) {
  const {id, text} = req.body;
  const data = readDb()
  
  const user = req.user
  const userCheck = data['users'].find((u)=> u.id === user.userId)
  
  
  
}



module.exports = { newsFeedPost, getAllPost };
