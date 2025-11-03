const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())

const userAuth = require('./router/user.route')
const post = require('./router/post.route')

const db = require('./config/db.js')
const User = require("./models/users.js")


// sequelize.authenticate()
//   .then(() => console.log('✅ Connected to MySQL'))
//   .catch(err => console.error('❌ Database connection failed:', err));


app.get('/', (req, res) =>{
    res.status(200).json({
        "success": true,
        "message": "Wecome to Farm chain"
    })
})



app.use('/auth', userAuth)
app.use('/post', post)
app.use('/users', userAuth)



const PORT = process.env.PORT || 3001



db.sync({force: false, alter: false }).then(async() => {

    await User.sync()

     app.listen(PORT, () => {
    console.log(`✅ Database connected successfully and Server running on PORT:${PORT}`);
});

}).catch((e)=>{
    console.log(`❌ Database connection failed:`, e);
    
})

