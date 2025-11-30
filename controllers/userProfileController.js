const { Users, Profile, Relationship, Notification, Posts, Likes } = require('../models');

// Get single user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const currentUserId = req.user.userId;

    // 1️⃣ Get user
    const user = await Users.findByPk(id, {
      attributes: ["id", "first_name", "last_name", "state", "country"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Get profile
    const profile = await Profile.findOne({
      where: { user_id: id },
    });

    // 3️⃣ Check if current user is following this profile
    const relationship = await Relationship.findOne({
      where: {
        follower_id: currentUserId,
        followed_id: id,
      },
    });
    const isFollowed = relationship ? relationship.following : false;

    // 4️⃣ Get followers/following counts
    const followers = await Relationship.count({
      where: { followed_id: id, following: true },
    });
    const following = await Relationship.count({
      where: { follower_id: id, following: true },
    });

    // 5️⃣ Get user's posts
    const posts = await Posts.findAll({
      where: { user_id: id },
      include: [
        {
          model: Likes,
          as: "likesData",
          where: { user_id: currentUserId }, // check if current user liked
          required: false,
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 6️⃣ Add isLike to each post
    const formattedPosts = posts.map((post) => ({
      ...post.toJSON(),
      isLike: post.likesData.length > 0,
    }));

    // 7️⃣ Count total likes received on all user's posts
    const likesCount = await Likes.count({
      include: [
        {
          model: Posts,
          as: "post",
          where: { user_id: id },
          attributes: [],
        },
      ],
    });

    // 8️⃣ Count total posts
    const postsCount = posts.length;

    // 9️⃣ Send response
    res.status(200).json({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      location: `${user.state}, ${user.country}`,
      avatar: profile?.avatar || null,
      cover_avatar: profile?.cover_avatar || null,
      bio: profile?.bio || "",
      organization: profile?.organization || "",
      verified: profile?.verified,
      followers,
      following,
      isFollowed,
      postsCount,
      likesCount,
      posts: formattedPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// Toggle follow/unfollow a user
const followUser = async (req, res) => {
  try {
    const followerId = req.user?.userId;
    const followedId = req.body?.followed_id;

    if (!followerId) return res.status(401).json({ error: "Unauthorized" });
    if (!followedId) return res.status(400).json({ error: "followed_id is required" });
    if (followerId === followedId) return res.status(400).json({ error: "You cannot follow yourself" });

    // Check if relationship exists
    let relationship = await Relationship.findOne({
      where: { follower_id: followerId, followed_id: followedId }
    });

    if (relationship) {
      // UNFOLLOW → delete row
      await relationship.destroy();

      const followersCount = await Relationship.count({ where: { followed_id: followedId } });

      return res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
        following: false,
        followersCount
      });
    }

    // FOLLOW → create row
    if (!Relationship) {
      console.warn("Relationship model is undefined!");
      return res.status(500).json({ error: "Relationship model is not available" });
    }

    relationship = await Relationship.create({
      follower_id: followerId,
      followed_id: followedId,
      following: true
    });

    const followersCount = await Relationship.count({ where: { followed_id: followedId } });

    // Create notification safely
    if (Notification) {
      const user = await Users.findByPk(followerId, { attributes: ["first_name", "last_name"] });

      if (user) {
        await Notification.create({
          user_id: followedId,
          type: 'social',
          notification: `${user.first_name} ${user.last_name} started following you.`,
          is_read: false
        });
      } else {
        console.warn(`Follower user not found for ID ${followerId}`);
      }
    } else {
      console.warn("Notification model is undefined, skipping notification");
    }

    return res.status(200).json({
      success: true,
      message: "Followed successfully",
      following: true,
      followersCount
    });

  } catch (err) {
    console.error("❌ FollowUser Error:", err);
    return res.status(500).json({
      error: "Something went wrong",
      details: err.message || err
    });
  }
};


const getUserProfile = async (req, res) => {

  const id = req.user?.userId


    // Followers
     const followers = await Relationship.count({
      where: { followed_id: id }
    });
    const following = await Relationship.count({
      where: { follower_id: id }
    });

     //  Get user's posts
    const posts = await Posts.findAll({
      where: { user_id: id },
      include: [
        {
          model: Likes,
          as: "likesData",
          where: { user_id: id }, // check if current user liked
          required: false,
          attributes: ["id"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Add isLike to each post
    const formattedPosts = posts.map((post) => ({
      ...post.toJSON(),
      isLike: post.likesData.length > 0,
    }));

    //  Count total likes received on all user's posts
    const likesCount = await Likes.count({
      include: [
        {
          model: Posts,
          as: "post",
          where: { user_id: id },
          attributes: [],
        },
      ],
    });

    // Count total posts
    const postsCount = posts.length;

    const personalProfile = {
      followers: followers,
      following: following,
      totalPost: postsCount,
      posts: formattedPosts,
      totalLikes: likesCount
    }

    res.status(200).json({
      "message": "User profile retrived successfully",
      "data": personalProfile
    })

}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserById, followUser, getAllUsers, getUserProfile };
