const {readDb, writeDb} = require('../utils/dbOperation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function register(req, res) {
    const {firstName, lastName, phone, email, address, state, country, password} = req.body;

    let data = readDb()

     if (!firstName || !lastName || !phone || !address || !state || !country || !email || !password) {
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


module.exports = {register}