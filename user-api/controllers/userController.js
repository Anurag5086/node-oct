const User = require('../models/User')

exports.getUserById = async (req, res) => {
    try{
        const userId = req.params.id

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({ success: false, message: "User not found!" })
        }

        res.status(200).json({ success: true, message: 'User fetched successfully!', user })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error", err: err.message})
    }
}

exports.createUser = async (req, res) => {
    try{
        const { name, email, phone } = req.body

        const user = await User.findOne({ email })
        if(user){
            res.status(400).json({ success: false, messgae: 'User already exists!' })
        }

        const newUser = await User.create({
            name,
            email,
            phone
        })

        res.status(201).json({ success: true, message: "User created successfully!", user: newUser })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error", err: err.message})
    }
}

exports.updateUser = async (req, res) => {
    try{
        const { name, email, phone } = req.body

        const userId = req.params.id

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({ success: false, message: "User not found!" })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, phone }, { new: true })

        res.status(200).json({ success: true, message: "User updateed successfully!", updatedUser })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error", err: err.message})
    }
}

exports.deleteUser = async (req, res) => {
    try{
        const userId = req.params.id

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({ success: false, message: "User not found!" })
        }

        await User.findByIdAndDelete(userId)

        res.status(200).json({ success: true, message: 'User deleted successfully!' })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error", err: err.message})
    }
}