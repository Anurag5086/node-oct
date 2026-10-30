const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getUser, updateUser, deleteUser, getAllUsersForAdmin } = require('../controllers/userControllers')
const adminMiddleware = require('../middlewares/adminMiddleware')
const router = express.Router()

router.get('/get-user', authMiddleware, getUser)
router.get('/get-all-users', authMiddleware, adminMiddleware, getAllUsersForAdmin)
router.put('/update-user', authMiddleware, updateUser)
router.delete('/delete-user', authMiddleware, deleteUser)

module.exports = router