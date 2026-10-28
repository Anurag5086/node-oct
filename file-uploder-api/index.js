const express = require('express')
const app = express()
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const fileRoutes = require('./routes/fileRoutes')

app.use(helmet())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET']
}))
app.use(rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 20,
    message: {
        message: "Too many requests! Try again later."
    }
}))

app.use('/api/file', fileRoutes)
app.use('/uploads', express.static('uploads'))

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected!'))
        .catch((err) => console.log('Failed to connect to MongoDB!', err ))

app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT: ${process.env.PORT}`)
})