const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try{
        let token = req.cookies.token

        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return res.status(401).json({ success: false, message: "Access denied! No token provided!" })
        }

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedPayload

        next()
    }catch(err){
        return res.status(401).json({ success: false, message: "Invalid or expired token!" })
    }
}

module.exports = authMiddleware