const productModel = require('../models/productModel');

exports.createProduct = async(req,res,next)=>{
    try {
        const {name,description,price} = req.body;


        const images = req.files.map(file=>file.publicUrl).filter(url=> url?true:false);



        if(!name || !description || !price){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            });
        }
        
        
         const product = await productModel.create({name,description,price,images,seller:req.user._id});
        res.status(200).json({
            success:true,
            message:'Product created successfully'
        });
        

    } catch (error) {
    }
}
