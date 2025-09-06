import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import orgRoutes from "./routes/org.routes.js";
import spaceRoutes from "./routes/space.routes.js";
import redisClient from "./redis/redisClient.js";
import subscriber from "./redis/subscriber.js";
import User from "./models/User.js";
import Organization from "./models/Organization.js";
import Space from "./models/Space.js";


dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
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

app.use("/auth/org/:id/space", spaceRoutes);
app.use("/auth/org", orgRoutes);
app.use("/auth", authRoutes);


await subscriber.subscribe("org:join", async (message) => {
    const event = JSON.parse(message);
    const { data } = event;
    console.log("org join event received:", event);
    if (!data) {
        console.error("No data found in the message");
        return;
    }
    const member = await User.findOne({ email: data.email });
    if (!member) {
        console.error("No member found with email:", data.email);
        return;
    }
    const { orgName, role } = data.data;
    const org = await Organization.findOne({ name: orgName });
    if (!org) {
        console.error("No organization found with name:", orgName);
        return;
    }

    console.log(member, org)

    if (org.members.some(m => m.userId.toString() == member._id.toString())) {
        console.log("User already a member of the organization");
        return;
    }

    org.members.push({ userId: member._id, role: role });
    await org.save();
    console.log(`User ${data.email} added to organization ${orgName} as ${role}`);

    redisClient.publish("org:joined", JSON.stringify({ orgName: org.name, role: role, notifId: data._id }));

});

await subscriber.subscribe("space:join", async (message) => {
    const event = JSON.parse(message);
    const { data } = event;

    if (!data) {
        console.error("No data found in the message");
        return;
    }
     const member = await User.findOne({ email: data.email });
    if (!member) {
        console.error("No member found with email:", data.email);
        return;
    }
    const { spaceId, role } = data.data;
    const space = await Space.findById(spaceId);
    if (!space) {
        console.error("No space found");
        return;
    }

    space.members.push({ userId: member._id, role: role });
    await space.save();
    console.log(`User ${data.email} added to space ${data.data.spaceName} as ${role}`);

    redisClient.publish("space:joined",JSON.stringify({spaceName:space.name,role:role,notifId:data._id}));

});

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
