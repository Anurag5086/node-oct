const Category = require('../models/Category')
const Product = require('../models/Product')
const joi = require('joi')

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({ isActive: true })
        if(products.length < 1){
            return res.status(404).json({ success: false, message: "Products not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched products!", products })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getProductById = async (req, res) => {
    try{
        const id = req.params.id

        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched product!", product })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getAllProductsForCategory = async (req, res) => {
    try{
        const categoryId = req.params.categoryId

        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(404).json({ success: false, message: "Category not found!" })
        }

        const productsInCategory = await Product.find({ categoryId, isActive: true }).populate('categoryId', 'title description')
        if(productsInCategory.length < 1){
            return res.status(404).json({ success: false, message: "Products in Category not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched products in category!", products: productsInCategory })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getAllProductsForAdmin = async (req, res) => {
    try{
        const products = await Product.find().populate('categoryId', 'title description')
        if(products.length < 1){
            return res.status(404).json({ success: false, message: "Products not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched products for admin!", products })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getAllProductsForCategoryForAdmin = async (req, res) => {
    try{
        const categoryId = req.params.categoryId

        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(404).json({ success: false, message: "Category not found!" })
        }

        const productsInCategory = await Product.find({ categoryId }).populate('categoryId', 'title description')
        if(productsInCategory.length < 1){
            return res.status(404).json({ success: false, message: "Products in Category not found!" })
        }

        return res.status(200).json({ success: true, message: "Successfully fetched products in category!", products: productsInCategory })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.createProduct = async (req, res) => {
    try{
        const { title, description, mrpPrice, sellingPrice, images, categoryId, stockQty, rating, noOfReviews, brand } = req.body

        const schema = joi.object({
            title: joi.string().min(3).max(100).trim().required(),
            description: joi.string().min(3).max(500).trim().required(),
            mrpPrice: joi.number().min(0).required(),
            sellingPrice: joi.number().min(0).required(),
            images: joi.array().required(),
            categoryId: joi.string().required(),
            stockQty: joi.number().min(0).required(),
            rating: joi.number().min(0).max(5).optional(),
            noOfReviews: joi.number().min(0).optional(),
            brand: joi.string().trim().required()
        })

        const { error } = schema.validate({ title, description, mrpPrice, sellingPrice, images, categoryId, stockQty, rating, noOfReviews, brand })
        if(error){
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const newProduct = new Product({ title, description, mrpPrice, sellingPrice, images, categoryId, stockQty, rating, noOfReviews, brand })

        await newProduct.save()

        return res.status(201).json({ success: true, message: "Successfully created product!", product: newProduct })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const id = req.params.id

        const { title, description, mrpPrice, sellingPrice, images, categoryId, stockQty, rating, noOfReviews, brand, isActive } = req.body

        const schema = joi.object({
            title: joi.string().min(3).max(100).trim().required(),
            description: joi.string().min(3).max(500).trim().required(),
            mrpPrice: joi.number().min(0).required(),
            sellingPrice: joi.number().min(0).required(),
            images: joi.array().required(),
            categoryId: joi.string().required(),
            stockQty: joi.number().min(0).required(),
            rating: joi.number().min(0).max(5).optional(),
            noOfReviews: joi.number().min(0).optional(),
            brand: joi.string().trim().required(),
            isActive: joi.boolean().optional()
        })

        const { error } = schema.validate({ title, description, mrpPrice, sellingPrice, images, categoryId, stockQty, rating, noOfReviews, brand, isActive })
        if(error){
            return res.status(400).json({ success: false, message: 'Invalid Input!', error })
        }

        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found!" })
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })

        return res.status(200).json({ success: true, message: "Successfully updated product!", product: updatedProduct })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const id = req.params.id

        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found!" })
        }

        await Product.findByIdAndDelete(id)

        return res.status(200).json({ success: true, message: "Successfully deleted product!" })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}