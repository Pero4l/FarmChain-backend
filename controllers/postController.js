const { Posts, Notifications, Profile, Likes } = require("../models");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload from buffer (memoryStorage)
function uploadBufferToCloudinary(buffer, mimetype, folder) {
  return new Promise((resolve, reject) => {
    const type = mimetype.startsWith("video") ? "video" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: type, 
        public_id: uuidv4(),
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
}

async function newsFeedPost(req, res) {
  try {
    const { content, farmSize, tags, category } = req.body;
    const user = req.user;
    const user_id = user.userId;

    const profile = await Profile.findOne({
      attributes: ["avatar", "verified"],
      where: { user_id },
    });

    const avatar = profile?.avatar || null;
    const verified = profile?.verified || false;

    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    console.log("Files received:", req.files);

    // VALIDATION
    if (images.length && !videos.length && images.length > 10)
      return res.status(400).json({ success: false, message: "Max 10 images allowed" });

    if (videos.length && !images.length && videos.length > 4)
      return res.status(400).json({ success: false, message: "Max 4 videos allowed" });

    if (images.length && videos.length && (images.length > 4 || videos.length > 2))
      return res.status(400).json({
        success: false,
        message: "When uploading both, max is 4 images + 2 videos",
      });

    // UPLOAD IMAGES
   const uploadedImages = await Promise.all(
  images.map((img) =>
    uploadBufferToCloudinary(img.buffer, img.mimetype, "posts/images")
  )
);

  // ---- UPLOAD VIDEOS ----
const uploadedVideos = await Promise.all(
  videos.map((vid) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "posts/videos",
          resource_type: "video",
          public_id: uuidv4(),
        },
        (error, result) => {
          if (error) {
            console.error("Video upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(vid.buffer);
    })
  )
);



    // CREATE POST
    const newPost = await Posts.create({
      user_id,
      farmer: user.currentUser,
      location: user.location,
      avatar,
      verified,
      farmSize,
      content,
      images: uploadedImages.map((i) => i.secure_url),
      videos: uploadedVideos.map((v) => v.secure_url),
      likes: 0,
      comments: 0,
      shares: 0,
      tags: tags ? tags.split(/[, ]+/).filter(Boolean) : [],
      category: category || "general",
    });

    await Notifications.create({
      user_id,
      type: "post",
      notification: "Your post was created successfully",
      is_read: false,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });

  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create post",
      error: error.message,
    });
  }
}

async function getAllPosts(req, res) {
  const userId = req.user?.userId; 

  try {
    const posts = await Posts.findAll({
      order: [["createdAt", "DESC"]],
      raw: true, 
    });

    // Add `isLike` per post
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const liked = userId
          ? await Likes.findOne({
              where: { post_id: post.id, user_id: userId },
            })
          : null;

        return {
          ...post,
          isLike: !!liked, // true if liked, false otherwise
        };
      })
    );

    return res.status(200).json({
      success: true,
      posts: postsWithLikeStatus,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


async function postLike(req, res) {
  const { postId } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Check if post exists
    const post = await Posts.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 2. Check if user already liked
    const existingLike = await Likes.findOne({
      where: { post_id: postId, user_id: userId },
    });

    // ========= UNLIKE =========
    if (existingLike) {
      await existingLike.destroy();

      // Update cached like count
      post.likes = post.likes - 1;
      await post.save();

      // Return accurate count from DB
      const totalLikes = await Likes.count({ where: { post_id: postId } });

      return res.status(200).json({
        success: true,
        action: "unliked",
        message: "Post unliked",
        likes: totalLikes,
        isLike: false,
      });
    }

    // ========= LIKE =========
    await Likes.create({
      user_id: userId,
      post_id: postId,
      is_like: true,
    });

    // Update cached likes
    post.likes = post.likes + 1;
    await post.save();

    // Create notification
   if (post.user_id !== userId) {
  await Notifications.create({
    user_id: post.user_id,
    type: "like",
    notification: `${req.user.currentUser} liked your post`,
    is_read: false,
  });
}

    // Return accurate count from DB
    const totalLikes = await Likes.count({ where: { post_id: postId } });

    return res.status(200).json({
      success: true,
      action: "liked",
      message: "Post liked",
      likes: totalLikes,
      isLike: true,
    });

  } catch (error) {
    console.error("LIKE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}



async function  deletePost(req, res) {
  const id = req.body.id;
  try {
    const post = await Posts.findOne({ where: { id: id } });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    await post.destroy();
    return res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}



module.exports = { newsFeedPost, getAllPosts, deletePost, postLike };
