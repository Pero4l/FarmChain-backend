const express = require('express')
const app = express()

const PORT = 9000

app.get('/', (req, res) =>{
    res.status(200).json({
        "success": true,
        "message": "Wecome to Farm chain"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
    
})