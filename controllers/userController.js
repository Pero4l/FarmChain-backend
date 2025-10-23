const {readDb, writeDb} = require('../utils/dbOperation')
const { users } = require ('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function register(req, res) {
    const {firstName, lastName, gender, phone, email, address, state, country, password} = req.body;

    let data = readDb()

     if (!firstName || !lastName || !gender || !phone || !address || !state || !country || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });

    } else if ( !/[A-Z]/.test(password) || !/[a-z]/.test(password)){
         return res.status(400).json({
            message: "Password must contain both uppercase and lowercase letters"
        });

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({message: "Invalid email format"});

    } else if (firstName.length < 3 || lastName.length < 3) {
        return res.status(400).json({message: "Name must be at least 3 characters"});
    }

    if(data['users'].find((u)=> u.email === email)){
         return res.status(400).json({
            "success": false,
            "message": "User already exists"
        })
    }


    const hashedPassword = await bcrypt.hash(password, 12)
    const id = data['users'].length + 1;
    const createdAt = new Date().toLocaleString();

    const newUser = {
        id,
        firstName,
        lastName,
        gender, 
        email, 
        phone, 
        address, 
        state, 
        country, 
        password: hashedPassword, 
        createdAt, 
        userProfile: {}, 
        notifications: []}


    newUser['notifications'].push({notification:`Account created successfully`})

    data['users'].push(newUser)
    writeDb(data)

    res.status(201).json({ 
        "success" : true,
        "message": "Account registered successfully",
        "data": newUser
    });
}


async function login(req, res) {

    const token = jwt.sign({
        userId: req.data.id,
        currentUser: `${req.data.firstName} ${req.data.lastName}`, 
        location: `${req.data.state}, ${req.data.country}`, 
        verified: req.data.verified}, process.env.JWT_SECRET, {expiresIn: '5h'})



    const userId = req.data.id
    const currentUser = `${req.data.firstName} ${req.data.lastName}`
    const location = `${req.data.state}, ${req.data.country}`
    const verified = req.data.verified
    
    if(req.user){
        return res.status(200).json({
        "success": true,
        "message": "Login Successfully",
        "token": token,
        "userId": userId,
        "currentUser": currentUser,
        "location": location,
        "verified": verified
    })
    }
    
}


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.findAll();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




module.exports = {register, login, getAllUsers, getUserById}