const adminMiddleware = (req, res, next) => {
    try{
        const role = req.user.role || req.user.roles
        if(role !== 'admin'){
            return res.status(403).json({ success: false, message: "Forbidden! You must be an admin!" })
        }

        next()
    }catch(err){
        return res.status(500).json({ success: false, message: "Internal Server Error!" })
    }
}

module.exports = adminMiddleware