const Order = require('../models/Order');
const joi = require('joi')

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find().populate('products.product').populate('userId', 'name email').sort({ createdAt: -1 })

        res.status(200).json({ success: true, message: 'Orders fetched successfully!', orders })
    }catch(err){
        res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getAllOrdersForUser = async (req, res) => {
    try{
        const userId = req.user.userId

        const orders = await Order.find({ userId }).populate('products.product').sort({ createdAt: -1 })

        return res.status(200).json({ success: true, message: 'Orders fetched successfully!', orders })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.getOrderById = async (req, res) => {
    try{
        const id = req.params.id

        const order = await Order.findById(id).populate('products.product')
        if(!order){
            return res.status(404).json({ success: false, message: "Order not found!" })
        }

        return res.status(200).json({ success: true, message: 'Orders fetched successfully!', order })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.createOrder = async (req, res) => {
    try{
        const { products, totalAmount, paymentMethod, razorpayPaymentId, razorpayOrderId, shippingAddress } = req.body

        const schema = joi.object({
            products: joi.array().items(
                joi.object({
                    product: joi.string().required(),
                    quantity: joi.number().integer().min(1).required()
                })
            ).min(1).required(),
            totalAmount: joi.number().min(0).required(),
            paymentMethod: joi.string().valid('COD', 'Razorpay').required(),
            razorpayOrderId: joi.string().optional(),
            razorpayPaymentId: joi.string().optional(),
            shippingAddress: joi.string().required()
        })

        const { error } = schema.validate({ products, totalAmount, paymentMethod, razorpayPaymentId, razorpayOrderId, shippingAddress })
        if(error){
            return res.status(400).json({ success: false, message: 'Invalid Input!' })
        }

        const userId = req.user.userId

        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            paymentMethod,
            shippingAddress,
            razorpayOrderId: razorpayOrderId || null,
            razorpayPaymentId: razorpayPaymentId || null
        })

        await newOrder.save()

        return res.status(200).json({ success: true, message: 'Order created successfully!', order: newOrder })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try{
        const orderId = req.params.id
        const { status } = req.body

        const schema = joi.object({
            status: joi.string().required()
        })

        const { error } = schema.validate({ status })
        if(error){
            return res.status(400).json({ success: false, message: "Invalid Input!" })
        }

        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).json({ success: false, message: "Order not found!" })
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate('products.product').populate('userId', 'name email')

        return res.status(200).json({ success: true, message: 'Order updated successfully!', updatedOrder })
    }catch(err){
        return res.status(500).json({ success: false, message: 'Internal Server Error!' })
    }
}