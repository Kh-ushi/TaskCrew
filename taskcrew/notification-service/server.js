import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import notificationRoutes from "./routes/notification.routes";
import { startSubscriber } from "./redis/subscriber";
import connectDb from "./config/db";

dotenv.config();
const app = express();
app.use(cors(), express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/notifications", notificationRoutes);

const startServer = async () => {
try {
        await connectDb();
        await startSubscriber();
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