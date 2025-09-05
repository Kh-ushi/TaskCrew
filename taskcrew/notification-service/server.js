import http from "http";
import express from "express";
import { Server } from "socket.io"
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import redisClient from "./redis/redisClient.js";
import { createClient } from "redis";
import Notification from "./models/Notification.js";
import jwt from "jsonwebtoken";
import notificationRoutes from "./routes/notification.routes.js";
dotenv.config();

// import notificationRoutes from "./routes/notification.routes.js";
// import { startSubscriber } from "./redis/subscriber.js";
import connectDb from "./config/db.js";
import { channel } from "diagnostics_channel";


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/notifications", notificationRoutes);


const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: true, credentials: true },
    path: "/ws"
});





io.use((socket, next) => {
    console.log("Incoming socket connection");
    console.log(socket.handshake.auth.token);
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error"));
    }
    try {
        console.log(process.env.JWT_SECRET);
        const  payload=jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload); 
        socket.data.email = payload.email;
        socket.join(`user:${payload.email}`);
        console.log("User joined:", payload.email);
        return next();
    } catch (err) {
        console.log(err);
        return next(new Error("Authentication error"));

    }
});



io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const token = socket.handshake.auth?.token;
    socket.on("notification:join", ({room,data}) => {
        console.log("Joining room:", room);
        socket.join(room);
        redisClient.publish("org:join",JSON.stringify({data,token}));
    });
});



const sub = createClient({ url: process.env.REDIS_URL });
await sub.connect();

const kv = createClient({ url: process.env.REDIS_URL });
await kv.connect();


const buildText = (evt) => {
    if (evt.type == "project:created") return `New project created: ${evt.data.title}`;
    if (evt.type == "project:updated") return `Project updated: ${evt.data.title}`;
    if (evt.type == "project:deleted") return `Project deleted: ${evt.data.title}`;
    if(evt.type=="org:invite")return `You have been invited to join the organization: ${evt.data.orgName}`;
    return evt.type;
}

const resolveTargets = async (evt) => {
    const set = new Set([
        ...(evt.data?.assignedTo || []),
        ...(evt.data?.watchers || []),
        ...(evt.data?.subscribers || []),
        ...(evt.data?.email || [])
    ]);
    return [...set];
};


await sub.subscribe("events", async (msg) => {

    console.log("Received event:", msg);
    const evt = JSON.parse(msg);
    const targets = await resolveTargets(evt);
    console.log("Notification targets:", targets);

    if (!targets) {
        return;
    }

    let docs = [];
    docs = targets.map((email) => ({
        email,
        type: evt.type,
        title: buildText(evt),
        data: evt.data,
        message: evt?.message || "No message",
        channel: evt?.channel || "general",
        isJoin: evt.type==="org:invite"?true:false
    }));

    console.log("Notification documents:", docs);

    const result = await Notification.insertMany(docs);
    console.log("Notifications saved:", result);
    for (const email of targets) {
    await kv.incr(`notif:unread:${email}`);
    console.log(`Unread notifications for ${email}: ${await kv.get(`notif:unread:${email}`)}`);
    const payload = docs.find(doc => doc.email === email);
    console.log(payload);
    io.to(`user:${email}`).emit("notification", payload);
    const count = Number(await kv.get(`notif:unread:${email}`) || 0);
    io.to(`user:${email}`).emit("notification:unread", { count });
}


});


await sub.subscribe("org:joined", async(message) => {
    const event=JSON.parse(message);
    const {orgName,role,notifId}=event;
    const notif=await Notification.findByIdAndUpdate(notifId,{isRead:true,isJoin:false},{new:true});
    io.to(`user:${notif.email}`).emit("notification:resolved", notif);
    await kv.decr(`notif:unread:${notif.email}`);
    const count = Number(await kv.get(`notif:unread:${notif.email}`) || 0);
    io.to(`user:${notif.email}`).emit("notification:unread", { count });
    console.log(`User ${notif.email} joined organization ${orgName} as ${role}`);
});






const startServer = async () => {
    try {
        await connectDb();
        // await startSubscriber();
        server.listen(process.env.PORT, () => console.log(`notif service listening on :${process.env.PORT}`));
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
