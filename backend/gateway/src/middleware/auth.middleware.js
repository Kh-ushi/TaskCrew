require('dotenv').config();

const jwt=require("jsonwebtoken");

const verifyToken=(req,res,next)=>{
    console.log("I am in authenticate");
    const token=req.headers.authorization?.split(" ")[1];
    console.log(req.headers);

    if(!token)return res.status(500).json({error:"Unauthorized"});
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(error){
        res.status(500).json({error:"Invalid Token"});
    }
}

module.exports=verifyToken;