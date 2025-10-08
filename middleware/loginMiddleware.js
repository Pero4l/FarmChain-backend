const {readDb} = require('../utils/dbOperation')
const bcrypt = require('bcrypt')

async function loginMiddleware(req, res, next){
    const {email, phone, password} = req.body

    const data = readDb()

    if ((!email && !phone) || !password) {
        return res.status(400).json({
            success: false,
            message: "Either email or phone, and password, are required"
        });
    }

    const existUser = data['users'].find((u) => u.email === email || u.phone === phone)

    if (!existUser) {
        return res.status(404).json({
            success: false,
            message: "User does not exist"
        });
    }

    const passMatch = await bcrypt.compare(password, existUser.password)
     if (!passMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    req.user = passMatch
    req.data = existUser
    next()
}


module.exports = {
    loginMiddleware
}