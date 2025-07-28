import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const startServer = async () => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};


startServer();
