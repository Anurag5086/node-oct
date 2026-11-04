const crypto = require('crypto')
const Razorpay = require('razorpay')
const joi = require('joi')
const Order = require('../models/Order')
const { resolveCartPricing } = require('../utils/orderPricing')

const cartItemSchema = joi.object({
    product: joi.string().required(),
    quantity: joi.number().integer().min(1).required(),
})

function getRazorpayClient() {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
        throw new Error('Razorpay is not configured on the server')
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { items } = req.body
        const { error } = joi.array().items(cartItemSchema).min(1).required().validate(items)
        if (error) {
            return res.status(400).json({ success: false, message: 'Invalid cart items' })
        }

        const { totalAmount } = await resolveCartPricing(items)
        const amountPaise = Math.round(totalAmount * 100)
        if (amountPaise < 100) {
            return res.status(400).json({ success: false, message: 'Order amount is too low for online payment' })
        }

        const razorpay = getRazorpayClient()
        const receipt = `rcpt_${req.user.userId}_${Date.now()}`
        const rpOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt,
        })

        return res.status(200).json({
            success: true,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: rpOrder.amount,
            currency: rpOrder.currency,
            orderId: rpOrder.id,
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not start payment'
        if (message.includes('not configured')) {
            return res.status(503).json({ success: false, message })
        }
        if (
            message.includes('unavailable') ||
            message.includes('stock') ||
            message.includes('quantity') ||
            message.includes('empty')
        ) {
            return res.status(400).json({ success: false, message })
        }
        console.error('createRazorpayOrder', err)
        return res.status(500).json({ success: false, message: 'Could not create payment order' })
    }
}

exports.verifyRazorpayCheckout = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
        } = req.body

        const schema = joi.object({
            items: joi.array().items(cartItemSchema).min(1).required(),
            shippingAddress: joi.string().trim().min(10).required(),
            razorpay_order_id: joi.string().required(),
            razorpay_payment_id: joi.string().required(),
            razorpay_signature: joi.string().required(),
        })

        const { error } = schema.validate({
            items,
            shippingAddress,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
        })
        if (error) {
            return res.status(400).json({ success: false, message: 'Invalid payment verification payload' })
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET
        if (!keySecret) {
            return res.status(503).json({ success: false, message: 'Razorpay is not configured on the server' })
        }

        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex')

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' })
        }

        const existing = await Order.findOne({ razorpayPaymentId: razorpayPaymentId })
        if (existing) {
            return res.status(200).json({
                success: true,
                message: 'Order already recorded',
                order: existing,
            })
        }

        const { products, totalAmount } = await resolveCartPricing(items)

        const razorpay = getRazorpayClient()
        const rpOrder = await razorpay.orders.fetch(razorpayOrderId)
        if (Number(rpOrder.amount) !== Math.round(totalAmount * 100)) {
            return res.status(400).json({ success: false, message: 'Payment amount does not match order total' })
        }

        const userId = req.user.userId
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            paymentMethod: 'Razorpay',
            shippingAddress,
            razorpayOrderId: razorpayOrderId,
            razorpayPaymentId: razorpayPaymentId,
            status: 'confirmed',
        })

        await newOrder.save()

        return res.status(200).json({
            success: true,
            message: 'Payment verified and order placed',
            order: newOrder,
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Payment verification failed'
        if (
            message.includes('unavailable') ||
            message.includes('stock') ||
            message.includes('quantity') ||
            message.includes('empty')
        ) {
            return res.status(400).json({ success: false, message })
        }
        console.error('verifyRazorpayCheckout', err)
        return res.status(500).json({ success: false, message: 'Could not verify payment' })
    }
}
