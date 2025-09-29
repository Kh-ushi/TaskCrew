import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected succesfully");
    }
    catch(error){
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDb;