const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const assistantRoutes = require('./routes/assistantRoutes')

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/assistant', assistantRoutes)

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected!'))
        .catch((err) => console.log('Failed to connect to MongoDB!'))

app.listen(process.env.PORT, () => {
    console.log('Server is running at PORT: ', process.env.PORT)
})