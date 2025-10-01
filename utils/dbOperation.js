const fs = require('fs')

const filePath = './data.json'


function readDb(){
    try{
        if(!fs.existsSync(filePath)) return {users: [], posts: [], marketPlacePost: []}
        const data = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(data)
    } catch (err){
        console.log("Error reading file:", err);
        return {users: [], posts: [], marketPlacePost: []}
    }
}


function writeDb(data){
    try{
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (err){
        console.error("Error writing file:", err)
    }
}



module.exports = {
    readDb,
    writeDb
}