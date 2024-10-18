const express = require('express');
const router = express.Router();

const productModel = require('../models/productModel');
const upload = require('../config/multer.config');
const authmiddleware = require('../middlewares/auth');
const productController = require('../controller/producct.controller');



router.use(authmiddleware.isAuthenticated).use(authmiddleware.isSeller);

router.post('/create-product',authmiddleware.isAuthenticated,upload.any(),productController.createProduct);

module.exports = router;
