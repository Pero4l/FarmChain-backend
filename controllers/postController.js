const {readDb, writeDb} = require('../utils/dbOperation')

async function newsFeedPost(req, res) {
    const{content} = req.body

    
    
    if(!content){
        return res.status(400).json({
            "sucess": false,
            "message": "All field are required"
        })
    }

    
}