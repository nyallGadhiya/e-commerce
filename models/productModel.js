const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:[{
        type:String,
        required:true
    }],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
    
},{timestamps:true})

const Product = mongoose.model('product',productSchema);

module.exports=Product;