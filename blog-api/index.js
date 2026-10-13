const express = require('express')
const app = express()
const blogRoutes = require('./routes/blogRoutes')

app.use('/api', blogRoutes)

app.listen(3000, () => {
    console.log("Server is running at PORT: 3000")
})