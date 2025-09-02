
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";
import subTaskRoutes from "./routes/subtask.routes.js";
import attchmentRoutes from "./routes/attatchment.routes.js";
import { startProjectSnapShotConsumer } from "./helperFunctions/refreshSnapShots.js";


dotenv.config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);
// app.use("/api/tasks/:taskId/subtasks",subTaskRoutes);
// app.use("/api/tasks/:taskId/subtasks",attchmentRoutes);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
            // startProjectSnapShotConsumer()
            //     .then(() => console.log('Stream consumer started'))
            //     .catch(err => console.error('Stream consumer error:', err));
        });

    }
    catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};


startServer();