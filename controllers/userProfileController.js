const { where } = require('sequelize');
const { Users } = require('../models');
const { Profile } = require('../models');
const {Relationship} = require('../models');


// Get single user by ID
const getUserById = async (req, res) => {
  try {
  // user sharing
      const userSharing = req.user;
      const user_id = userSharing.userId;

      // Checking relationship
      const relationship = await Relationship.findOne({where: follower_id = user_id})



    const user = await Users.findByPk(req.params.id,{
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