const Product = require("../models/Product");
const Follow = require("../models/Follow");
const Order = require("../models/Order");

exports.getProducts = async (req,res)=>{
  const products = await Product.find().populate("farmer_id","name");

  res.json({
    success:true,
    data:products
  });
};

exports.followFarmer = async (req,res)=>{
  const follow = await Follow.create({
    consumer_id:req.user.id,
    farmer_id:req.body.farmer_id
  });

  res.json({
    success:true,
    data:follow
  });
};

exports.orderProduct = async (req,res)=>{
  const order = await Order.create({
    consumer_id:req.user.id,
    product_id:req.body.product_id,
    quantity:req.body.quantity
  });

  res.json({
    success:true,
    data:order
  });
};