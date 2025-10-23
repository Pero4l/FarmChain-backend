const express = require('express')
require('dotenv').config()
const { sequelize } = require('./models/index.js');
const app = express()
app.use(express.json())

const userAuth = require('./router/user.route')
const post = require('./router/post.route')


sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ Database connection failed:', err));


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

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
    
}) 