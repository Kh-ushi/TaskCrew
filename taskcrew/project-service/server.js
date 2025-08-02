import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import ProjectRoutes  from "./routes/project.routes.js"



dotenv.config();
const app = express();
app.use(cors({origin:true,credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/projects",ProjectRoutes);



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