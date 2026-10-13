const express = require('express')
const { getAllBlogs, getBlogById } = require('../controllers/blogController')
const router = express.Router()

router.get('/blogs', getAllBlogs) // URL - http://localhost:3000/api/blogs
router.get('/blog/:id', getBlogById) // URL - http://localhost:3000/api/blog/10

module.exports = router