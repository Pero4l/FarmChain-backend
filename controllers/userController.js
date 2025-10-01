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

    } else if (name.length < 3) {
        return res.status(400).json({message: "Name must be at least 3 characters"});
    }
}