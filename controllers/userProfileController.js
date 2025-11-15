const { Users } = require('../models');
const { Profile } = require('../models');



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

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id,{
      attributes:{
        exclude: ['password']
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// User Profile by default 
async function UserProfile(req, res) {
  
}




module.exports = { getAllUsers, getUserById, UserProfile };