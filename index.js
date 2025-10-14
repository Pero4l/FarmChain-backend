const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())

const userAuth = require('./router/user.route')
const post = require('./router/post.route')


app.get('/', (req, res) =>{
    res.status(200).json({
        "success": true,
        "message": "Wecome to Farm chain"
    })
})

app.use('/auth', userAuth)
app.use('/post', post)



const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
    
}) 