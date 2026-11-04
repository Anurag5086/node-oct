const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {
    createRazorpayOrder,
    verifyRazorpayCheckout,
} = require('../controllers/paymentController')

const router = express.Router()

router.post('/razorpay/create-order', authMiddleware, createRazorpayOrder)
router.post('/razorpay/verify', authMiddleware, verifyRazorpayCheckout)

module.exports = router
