const Blacklist = require('../models/blacklistModel');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


module.exports.isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        const blacklist = await Blacklist.findOne({token});

        if(blacklist){
            return res.status(400).json({message:'Token is blacklisted'});
        }

        if(!user){
            return res.status(400).json({message:'Token is required'});
        }

        req.user = user;
        next();
        
    } catch (error) {
        next(error);
    }
}

module.exports.isSeller = async(req,res,next)=>{
    try {
        const user = req.user;
        if(user.role !== 'seller'){
            return res.status(400).json({message:'You are not authorized to access this'});
        }
        next();
    } catch (error) {
        next(error);
    }
}
