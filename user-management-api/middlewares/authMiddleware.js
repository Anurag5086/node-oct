const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ success: false, message: "Unauthorized! Token not found!" })
        }

        const token = authHeader.split(" ")[1]

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedPayload
        next()
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error" , err })
    }
}

module.exports = authMiddleware