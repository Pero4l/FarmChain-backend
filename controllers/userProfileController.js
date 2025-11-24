// const { Users } = require('../models');
// const { Profile } = require('../models');
// const {Relationship} = require('../models');


// // Get single user by ID
// const getUserById = async (req, res) => {
//   // Correctly get the ID from params
//   const id = req.params.id;

//   try {
//     // user sharing
//     const userSharing = req.user;
//     const user_id = userSharing.userId;

//     // Checking relationship
//     const relationship = await Relationship.findOne({
//       where: {
//         follower_id: user_id,
//         followed_id: id
//       }
//     });

//     const isFollowing = relationship ? relationship.following : false;

//     // Count followers
//     const followers = await Relationship.count({
//       where: { followed_id: id }
//     });

//     // Count following
//     const following = await Relationship.count({
//       where: { follower_id: id }
//     });

//     // Get user profile
//     const profile = await Profile.findOne({
//       where: { user_id: id }
//     });

//     console.log(profile);
    
//     // Get basic user info
//     const user = await Users.findByPk(id, {
//       attributes: ["id", "first_name", "last_name", "state", "country"],
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const userProfile = {
//       name: `${user.first_name} ${user.last_name}`,
//       cover_avatar: profile?.cover_avatar || null,
//       avatar: profile?.avatar || null,
//       bio: profile?.bio || "",
//       organization: profile?.organization || "",
//       followers: followers,
//       following: following,
//       isFollowed: isFollowing
//     };

//     res.status(200).json(userProfile);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// const getUserById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const currentUserId = req.user.userId;

//     // Get user
//     const user = await Users.findByPk(id, {
//       attributes: ["id", "first_name", "last_name", "state", "country"],
//     });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Get profile
//     const profile = await Profile.findOne({
//       where: { user_id: id }
//     });

//     // Check if current user is following this profile
//     const relationship = await Relationship.findOne({
//       where: {
//         follower_id: currentUserId,
//         followed_id: id
//       }
//     });
//     const isFollowed = relationship ? relationship.following : false;

//     // Get followers/following counts
//     const followers = await Relationship.count({
//       where: { followed_id: id, following: true }
//     });
//     const following = await Relationship.count({
//       where: { follower_id: id, following: true }
//     });

//     res.status(200).json({
//       id: user.id,
//       name: `${user.first_name} ${user.last_name}`,
//       avatar: profile?.avatar || null,
//       cover_avatar: profile?.cover_avatar || null,
//       bio: profile?.bio || "",
//       organization: profile?.organization || "",
//       followers,
//       following,
//       isFollowed
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// Get all users
// const getAllUsers = async (req, res) => {
//   try {
//     const allUsers = await Users.findAll({
//       attributes: {
//         exclude: ["password"],
//       },
//     });
//     res.status(200).json(allUsers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// // User Profile by default 
// async function UserProfile(req, res) {
  
// }




// module.exports = { getAllUsers, getUserById, };





const { Users, Profile, Relationship, Notification, Posts } = require('../models');

// Get single user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const currentUserId = req.user.userId;

    // Get user
    const user = await Users.findByPk(id, {
      attributes: ["id", "first_name", "last_name", "state", "country"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get profile
    const profile = await Profile.findOne({
      where: { user_id: id }
    });

    // Check if current user is following this profile
    const relationship = await Relationship.findOne({
      where: {
        follower_id: currentUserId,
        followed_id: id
      }
    });
    const isFollowed = relationship ? relationship.following : false;

    // Get followers/following counts
    const followers = await Relationship.count({
      where: { followed_id: id, following: true }
    });
    const following = await Relationship.count({
      where: { follower_id: id, following: true }
    });

    // User posts count
    const postsCount = await Posts.count({
      where: { user_id: id }
    });

    const posts = await Posts.findAll({
      where: { user_id: id },
      // attributes: ['id', 'content', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

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
      posts
    });

  } catch (err) {
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

module.exports = { getUserById, followUser, getAllUsers };
