const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes')

app.use(express.json())

app.use('/api', userRoutes)

mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB Connected!'))
        .catch((err) => console.log('Failed to connect to MongoDB', err ))

app.listen(process.env.PORT, () => {
    console.log('Server is running at PORT: ', process.env.PORT)
})