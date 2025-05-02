require('dotenv').config();

const crypto=require("crypto");
const jwt=require("jsonwebtoken");

const path=require("path");

const generateToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"7d"});
}

const generateTeamCode=()=>{
    return crypto.randomBytes(3).toString("hex");
}


module.exports={generateToken,generateTeamCode};