const express = require('express')
const { createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController')
const router = express.Router()

router.post('/create-user', createUser)
router.get('/get-user/:id', getUserById)
router.put('/update-user/:id', updateUser)
router.delete('/delete-user/:id', deleteUser)

module.exports = router