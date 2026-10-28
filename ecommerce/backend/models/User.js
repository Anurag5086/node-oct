const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, 'Password is not in the right format!'] // password -> min 8 chars, atleast 1 number, 1 upper case, 1 lower case, 1 special char
    },
    phoneNumber: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: string,
        trim: true
    },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

module.exports = mongoose.model('users', userSchema)