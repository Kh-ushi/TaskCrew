import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import orgRoutes from "./routes/org.routes.js";


dotenv.config();
const app = express();

app.use(cors({origin:true,credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", (req, res, next) => {
    console.log("I am inside auth middleware");
    next();
  });
  
  app.use("/auth/org", (req, res, next) => {
    console.log("I am inside org middleware");
    next();
  });

  app.use("/auth/org", orgRoutes);
  
  app.use("/auth", authRoutes);

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
