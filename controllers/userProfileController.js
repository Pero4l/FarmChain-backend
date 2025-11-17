const { where, and } = require('sequelize');
const { Users } = require('../models');
const { Profile } = require('../models');
const {Relationship} = require('../models');


// Get single user by ID
const getUserById = async (req, res) => {
  const {id} = req.params.id
  try {
  // user sharing
      const userSharing = req.user;
      const user_id = userSharing.userId;

      // Checking relationship
     const relationship = await Relationship.findOne({
      where: {
        follower_id: user_id,
        followed_id: id
      }
    });
    // Return boolean
    const isFollowing = relationship.following

    // Count followers
    const followers = await Relationship.count({
    where: {followed_id: id}
    });
    // Count following
    const following = await Relationship.count({
    where:{ follower_id: id}
    });




    // Get user profile
    const profile = await Profile.findOne({
      where: id = id
    })




    const user = await Users.findByPk(id,{
      attributes: [
      "id",
      "first_name",
      "last_name",
      "state",
      "country",
    ],
    });

    const UserProfile = {
      name: `${user.first_name} ${user.last_name}`,
      cover_avatar: profile.cover_avatar,
      avatar: profile.avatar,
      bio: profile.bio,
      organization:profile.organization,
      followers: followers,
      following: following,
      relate: isFollowing
      
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
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




// // User Profile by default 
// async function UserProfile(req, res) {
  
// }




module.exports = { getAllUsers, getUserById, UserProfile };