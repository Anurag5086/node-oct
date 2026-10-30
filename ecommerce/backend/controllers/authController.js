const User = require('../models/User')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body

        const schema = joi.object({
            name: joi.string().trim().min(2).max(50).required(),
            email: joi.string().email().trim().lowercase().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/).required()
        })

        const { error } = schema.validate({ name, email, password })
        if(error){
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser){
            return res.status(400).json({ success: false, message: 'User already registered! Please login or use a different email id!', error })
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTS))

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({ success: true, message: 'User registered successfully!', user: newUser })
    }catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error!' })
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
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found! Please register!', error })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ success: false, message: 'Incorrect Password!' })
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        }).status(200).json({
            sucess: true,
            message: 'Logged In Successfully!',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}