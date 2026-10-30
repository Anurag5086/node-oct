const User = require('../models/User')
const joi = require('joi')

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.userId

        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not Present' })
        }

        return res.status(200).json({ success: true, message: 'User Present', user: existingUser })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getAllUsersForAdmin = async (req, res) => {
    try {
        const users = await User.find()
        if(users.length < 1){
            return res.status(404).json({ success: false, message: 'Users not Present' })
        }

        return res.status(200).json({ success: true, message: 'Successfully fetched all users for admin!', users })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address } = req.body;

        const schema = joi.object({
            name: joi.string().trim().min(2).max(50).required(),
            email: joi.string().email().trim().lowercase().required(),
            password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/).required(),
            phoneNumber: joi.string().trim().min(10).max(10).required(),
            address: joi.string().trim(),
        })

        const { error } = schema.validate({ name, email, password, phoneNumber, address })
        if (error) {
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User nahi mila!' });
        }

        user.name = name;
        user.email = email;
        user.password = password;
        user.phoneNumber = phoneNumber;
        user.address = address;

        await User.save();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully!',
            user
        });
    } catch (error) {
         res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.deleteUser = async (req,res) => {
        try {
           const userId = req.user.userId

            const userDelete = await User.findByIdAndDelete(userId)
            if (!userDelete) { 
                return res.status(404).json({
                    success: false, 
                    message: 'User nahi mila!' 
                }); 
            }

            return res.status(200).json({
                    success: true,
                    message: 'User Deleted successfully!'
            })
        } catch (error) {
          res.status(500).json({ success: false, message: 'Internal Server Error!' })
        }
}