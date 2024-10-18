const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middlewares/auth');


router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.post('/signout',auth.isAuthenticated,userController.signout);
router.get('/profile',auth.isAuthenticated,userController.getprofile);


router.get('/products',auth.isAuthenticated,userController.getProducts);
router.get('/products/:id',auth.isAuthenticated,userController.getProductById);
router.get('/order/:id',auth.isAuthenticated,userController.createOrder);
router.get('/verify/:id',auth.isAuthenticated,userController.verifyPayment);


module.exports = router;