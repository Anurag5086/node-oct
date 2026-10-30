const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { getAllProducts, getProductById, getAllProductsForCategory, getAllProductsForAdmin, getAllProductsForCategoryForAdmin, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const router = express.Router()

router.get('/get-all-products', getAllProducts)
router.get('/get-product/:id', getProductById)
router.get('/get-all-products-for-category/:categoryId', getAllProductsForCategory)
router.get('/get-all-products-admin', authMiddleware, adminMiddleware, getAllProductsForAdmin)
router.get('/get-all-products-for-category-admin/:categoryId', authMiddleware, adminMiddleware, getAllProductsForCategoryForAdmin)
router.post('/create-product', authMiddleware, adminMiddleware, createProduct)
router.put('/update-product/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/delete-product/:id', authMiddleware, adminMiddleware, deleteProduct)

module.exports = router