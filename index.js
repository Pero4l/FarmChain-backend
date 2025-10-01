const express = require('express')
require('dotenv').config()
const app = express()


app.use(express.json())

app.get('/', (req, res) =>{
    res.status(200).json({
        "success": true,
        "message": "Wecome to Farm chain"
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
    
}) 