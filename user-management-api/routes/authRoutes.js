const express = require('express')
const { registerUser, loginUser, getUserById } = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/get-user', authMiddleware, getUserById)

// router.get('/get-profile', authMiddleware, adminMiddleware, getProfile)
module.exports = router