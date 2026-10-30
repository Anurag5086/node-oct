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
        const products = await Category.find()
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

    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.updateProduct = async (req, res) => {
    try{

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