const multer = require('multer')
const path = require('path')

try{
    app.post('/upload', upload.single('avatar'), (req, res) => {
    res.send('File uploaded successfully')
})

const config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: config,
    limits: 2

})}catch(error){
    console.error("Error setting up multer:", error);

}

 


