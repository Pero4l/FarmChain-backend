const { Users } = require("../models");
const {Notifications} = require("../models")
const { Relationship } = require("../models");
const { Profile } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req, res) {
  try {
    
    const {
      first_name,
      last_name,
      gender,
      phone_no,
      email,
      address,
      state,
      country,
      password,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !gender ||
      !phone_no ||
      !address ||
      !state ||
      !country ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain both uppercase and lowercase letters" });
    } else if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain a number" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    } else if (first_name.length < 3 || last_name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);


    await Users.create({
      first_name,
      last_name,
      gender,
      email,
      phone_no,
      address,
      state,
      country,
      password: hashedPassword,
    });


    // HANDLE NOTIFICATION
    const isUser = await Users.findOne({ where: { email } });
    if (isUser) {

      await Notifications.create({
        user_id: isUser.id,
        type: 'account',
        notification: 'Your account was created successfully',
        is_read: false
      })
      
    }


    // HANDLE PROFILE CREATION
    let location =  `${state}, ${country}`
    let share = `main/${phone_no}`
    const user = await Users.findOne({ where: { email } });
    if (user) {

      await Profile.create({
        user_id: user.id, 
        bio: null || 'Excited to be part of the FarmChain community, let connect and grow together!',
        organization: 'eg FarmChain',
        location: location,
        verified: false,
        share_account: share,
      });
    }
    

    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


async function login(req, res) {
  
  const token = jwt.sign(
    {
      userId: req.data.id,
      currentUser: `${req.data.first_name} ${req.data.last_name}`,
      location: `${req.data.state}, ${req.data.country}`,
      email: `${req.data.email}`
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  // const userId = req.data.id;
  // const currentUser = `${req.data.first_name} ${req.data.last_name}`;
  // const location = `${req.data.state}, ${req.data.country}`;
  // const verified = req.data.verified

  const user = { 
   userId: req.data.id,
   currentUser: `${req.data.first_name} ${req.data.last_name}`,
   location: `${req.data.state}, ${req.data.country}`,
   email: `${req.data.email}`
  }


    // Get user profile
    const profile = await Profile.findOne({
  attributes: ['avatar', 'cover_avatar', 'bio', 'organization', 'location', 'verified', 'share_account'],
  where: { user_id: user.userId }
});

  // Get followers/following counts
    const followers = await Relationship.count({
      where: { followed_id: user.userId }
    });
    const following = await Relationship.count({
      where: { follower_id: user.userId }
    });


const personalProfile = {
  name: user.currentUser,
  location: profile?.location || "",
  avatar: profile?.avatar || null,
  cover_avatar: profile?.cover_avatar || null,
  bio: profile?.bio || "",
  organization: profile?.organization || "",
  verified: profile?.verified || false,
  followers: followers || 0,
  following: following || 0,
  share_account: profile?.share_account || ""
};


  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      token: token,
      user: user,
      profile: personalProfile
    });
  }


}



module.exports = { register, login };

