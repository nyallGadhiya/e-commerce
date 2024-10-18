const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistModel = require('../models/blacklistModel');
const productModel = require('../models/productModel');
const paymentModel = require('../models/paymentModel');
const orderModel = require('../models/orderModel');
const Razorpay = require('razorpay');

module.exports.signup = async(req,res,next)=>{

    try {
        const {username,email,password,role} = req.body;
        if(!username || !email || !password ){
            return res.status(400).json({message:'All fields are required'});
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new userModel({username,email,password:hashedPassword,role});
        await user.save();

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        res.status(201).json({message:'User created successfully',user,token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

module.exports.signin = async(req,res,next)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:'All fields are required'});
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:'Invalid password'});
        }

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        res.status(200).json({message:'User logged in successfully',user,token});
        
        
        
    } catch (error) {
        next(error);
    }
}

module.exports.signout = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(400).json({message:'Token is required'});
        }

        const existingToken = await blacklistModel.findOne({token});
        if(existingToken){
            return res.status(400).json({message:'Token already exists'});
        }

        await blacklistModel.create({token});
     
        res.status(200).json({message:'User logged out successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

module.exports.getprofile = async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).json({message:'User profile fetched successfully',user});
    } catch (error) {
        next(error);
    }
}

module.exports.getProducts = async(req,res,next)=>{

    try {
       
        const products = await productModel.find({});

        res.status(200).json({message:'Products fetched successfully',products});

    } catch (error) {
        next(error);
    }
}

module.exports.getProductById = async(req,res,next)=>{
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json({message:'particular Product fetched successfully',product});
    } catch (error) {
        next(error);
    }
}

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

module.exports.createOrder = async(req,res,next)=>{
    
    const product = await productModel.findById(req.params.id);

    const options = {
        amount: product.price * 100,
        currency: 'INR',
        receipt: 'order_receipt_' + Date.now(),

    };

    const order = await instance.orders.create(options);
    
    res.status(200).json({message:'Order created successfully',order});

    const payment = new paymentModel.create({
        order_id:order.id,
        amount:order.amount,
        currency:'INR',
        status:'pending'
    });

}

module.exports.verifyPayment = async(req,res,next)=>{

   try {
    
        const {paymentid,orderid,signature} = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const {validatePaymentVerification} = require('../node_modules/razorpay/dist/utils/razorpay-utils.js');

        const isValid = validatePaymentVerification({
            order_id:orderid,
            payment_id:paymentid,

        },signature,secret);

        if(isValid){
            const payment = await paymentModel.findOne({orderId:orderId});
            payment.status = 'success';
            payment.paymentId = paymentid;
            payment.signature = signature;
            await payment.save();
            order.status = 'success';
            await order.save();
            res.status(200).json({message:'Payment successful'});
        }else
        {
            const payment = await paymentModel.findOne({orderId:orderId});   
            payment.status = 'failed';
            await payment.save();

            res.status(400).json({message:'Payment failed'});
        }

   } catch (error) {
    
   }
    
    
}