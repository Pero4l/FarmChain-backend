const {readDb, writeDb} = require('../utils/dbOperation')

async function newsFeedPost(req, res) {
    const{content} = req.body

    const data = readDb()
    
    if(!content){
        return res.status(400).json({
            "sucess": false,
            "message": "All field are required"
        })
    }

    const existPost = data['posts'].find((p) => p.content === content)

    
}
