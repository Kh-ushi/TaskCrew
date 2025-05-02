const express=require("express");
const {generateToken,generateTeamCode}=require("../../helperFunction");

const User=require("../models/User");
const Team=require("../models/Team");


const router=express.Router();

router.post("/signUp",async(req,res)=>{

   try{
    const{fullName,email,password,confirmPassword}=req.body;
   
   if(!fullName||!email||!password||!confirmPassword){
    return res.status(500).json({error:"All fields are required"});
   }

   if(password!=confirmPassword){
    return res.status(500).json({error:"Passwords do not match"});
   }

   let existingUser=await User.findOne({email});

   if(existingUser){
    return res.status(500).json({error:"User already exists"});
   }

   const newUser=new User({name:fullName,email,password});
   await newUser.save();

   const token=generateToken(newUser);

   res.status(201).json({
    message:"User registered successfully",
    user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email
    },
    token
   });
   }
   catch(error){
    res.status(500).json({error:"Internal Server Error"});
   }

});


router.post("/login",async(req,res)=>{
    
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});

        if(!user || !(await user.comparePassword(password))){
            return res.status(500).json({error:"Invalid Credentials"});
        }

        const token=generateToken(user);

        res.status(201).json({
            message:"User has loggedIn Successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            token
        });

    }
    catch(error){
           console.log(error);
           console.error("Login Error",error);
           res.status(500).json({error:"Login Failed"});
    }

});


module.exports=router;