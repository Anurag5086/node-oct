const User = require('../models/User')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body

        const schema = joi.object({
            name: joi.string().min(2).max(50).trim().required(),
            email: joi.string().email().trim().lowercase().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/).required()
        })

        const { error } = schema.validate({ name, email, password })
        if(error){
            return res.status(400).json({ success: false, message: "Input is Invalid!", error })
        }

        const user = await User.findOne({ email })
        if(user){
            return res.status(400).json({ success: false, message: "Email already registered!", error })
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTS))

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!", 
            user: {
                    name: newUser.name,
                    email: newUser.email,
                    id: newUser._id
                  } 
            })
    }catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error!', error: err })
    }
}

exports.loginUser = async (req, res) => {
    try{
        const { email, password } = req.body

        const schema = joi.object({
            email: joi.string().email().trim().lowercase().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/).required()
        })

        const { error } = schema.validate({ email, password })
        if(error){
            return res.status(400).json({ success: false, message: "Input is Invalid!", error })
        }

        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({ success: false, message: "Email is not registered!", error })
        }

        // res { name, email, profileUrl } = google api
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(400).json({ success: false, message: "Incorrect password!", error })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({ success: true, message: "Logged In Successfully!", token })
    }catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error!', error: err })
    }
}

exports.getUserById = async (req, res) => {
    try{
        const userId = req.user.userId

        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({ success: false, message: "User not found!" })
        }

        res.status(200).json({ success: true, message: 'User fetched successfully!', user })
    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error", err: err.message})
    }
}