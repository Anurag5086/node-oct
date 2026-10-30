const Category = require('../models/Category')
const joi = require('joi')

exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find({ isActive: true })
        if(categories.length < 1){
            return res.status(404).json({ success: false, message: "Categories not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched categories!", categories })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}

exports.getCategoryById = async (req, res) => {
    try{
        const id = req.params.id

        const category = await Category.findById(id)
        if(!category){
            return res.status(404).json({ success: false, message: "Category not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched category!", category })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}

exports.getAllCategoriesForAdmin = async (req, res) => {
    try{
        const categories = await Category.find()
        if(categories.length < 1){
            return res.status(404).json({ success: false, message: "Categories not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched categories for admin!", categories })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}

exports.createCategory = async (req, res) => {
    try{
        const { title, description }  = req.body

        const schema = joi.object({
            title: joi.string().min(3).max(100).trim().required(),
            description: joi.string().min(3).max(500).trim().required(),
        })

        const { error } = schema.validate({ title, description })
        if(error){
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const newCategory = new Category({
            title,
            description
        })

        await newCategory.save()

        return res.status(201).json({ success: true, message: "Successfully created category!", category: newCategory })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}

exports.updateCategory = async (req, res) => {
    try{
        const { title, description, isActive }  = req.body

        const id = req.params.id

        const category = await Category.findById(id)
        if(!category){
            return res.status(404).json({ success: false, message: "Category not found!" })
        }

        await Category.findByIdAndUpdate(id, { title, description, isActive })

        return res.status(200).json({ success: true, message: "Successfully updated category!" })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}

exports.deleteCategory = async (req, res) => {
    try{
        const id = req.params.id

        const category = await Category.findById(id)
        if(!category){
            return res.status(404).json({ success: false, message: "Category not found!" })
        }

        await Category.findByIdAndDelete(id)

        return res.status(200).json({ success: true, message: "Successfully deleted category!" })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal server error!' })
    }
}