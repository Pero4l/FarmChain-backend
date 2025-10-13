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

    if(existPost){
        return res.status(400).json({
            "sucess": false,
            "message": "Post already exist"
        })
    }

    const user = req.user
    const id = data['posts'].length + 1
    const farm = user.name
    const location = user.location
    const avatar = user.id
    const gist = content
    

    const newPost = {

    }

}
