const express = require('express')
const { uploadFile } = require('../controllers/fileController')
const upload = require('../middlewares/multerMiddleware')
const router = express.Router()

router.post('/upload', upload.single('file'), uploadFile)

module.exports = router