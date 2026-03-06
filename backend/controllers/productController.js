const Product = require("../models/Product");

exports.addProduct = async (req,res)=>{
  try{

    const product = await Product.create({
      farmer_id:req.user.id,
      product_name:req.body.product_name,
      price:req.body.price,
      quantity:req.body.quantity
    });

    res.json({
      success:true,
      data:product
    });

  }catch(err){
    res.status(500).json({success:false,error:err.message});
  }
};

exports.getMyProducts = async (req,res)=>{
  try{

    const products = await Product.find({
      farmer_id:req.user.id
    });

    res.json({
      success:true,
      data:products
    });

  }catch(err){
    res.status(500).json({success:false,error:err.message});
  }
};