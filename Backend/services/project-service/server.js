import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

dotenv.config();
const app=express();

app.use(cors({origin:true,credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/project",projectRoutes);
app.use("/task",taskRoutes);


const startServer=async()=>{
    try{
        await connectDb();
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch(error){
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();