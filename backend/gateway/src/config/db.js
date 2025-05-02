require("dotenv").config();

const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        console.log(process.env.MONGODB_URL);
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB is connected");

    }
    catch(error){
        console.error(`Error:${error.message}`);
        process.exit(1);
    }
};

module.exports=connectDB;
