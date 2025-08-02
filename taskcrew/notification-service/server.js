import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import notificationRoutes from "./routes/notification.routes.js";
import { startSubscriber } from "./redis/subscriber.js";
import connectDb from "./config/db.js";

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