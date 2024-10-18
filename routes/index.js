const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middlewares/auth');

router.post('/signup',userController.signup);
router.post('/signin',userController.signin);
router.post('/signout',auth.isAuthenticated,userController.signout);

module.exports = router;