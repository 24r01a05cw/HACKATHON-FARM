const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req,res)=>{
  try{

    const {name,email,password,role} = req.body;

    const hash = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password:hash,
      role
    });

    res.json({
      success:true,
      data:user
    });

  }catch(err){
    res.status(500).json({success:false,error:err.message});
  }
};

exports.login = async (req,res)=>{
  try{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      });
    }

    const valid = await bcrypt.compare(password,user.password);

    if(!valid){
      return res.status(400).json({
        success:false,
        message:"Invalid password"
      });
    }

    const token = jwt.sign(
      {id:user._id,role:user.role},
      "secretkey"
    );

    res.json({
      success:true,
      token
    });

  }catch(err){
    res.status(500).json({success:false,error:err.message});
  }
};