const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 500,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('categories', categorySchema)