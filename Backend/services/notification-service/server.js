import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import subscriber from "./redis/subscriber.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const { PORT, JWT_SECRET } = process.env;

const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
    // path: "/ws"
});


io.use((socket, next) => {

    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: no token provided"));
        }
        const decode = jwt.verify(token, JWT_SECRET);
        socket.user = decode;
        next();
    }
    catch (error) {
        console.error("JWT Error:", err.message);
        next(new Error("Authentication error: invalid token"));
    }
});


subscriber.subscribe("notifications", (message) => {
    const event = JSON.parse(message);
    console.log(event);

    if (event?.event == 'Org:MembersAdded') {
        const { organization, members } = event;
        members.forEach((member) => {
            if (member.toString() !== organization.owner.toString()) {
                const room = `user:${member}`;
                io.to(room).emit("notification", {
                    message: `You Have Been Invited to Join ${organization.name}`,
                    orgId: organization._id
                });
            }
        });
    }

    if (event?.event == 'Org:MembersRemoved') {
        const { organization, members } = event;
        members.forEach((member) => {
            if (member.toString() !== organization.owner.toString()) {
                const room = `user:${member}`;
                io.to(room).emit("notification", {
                    message: `You Have Been Removed from ${organization.name}`,
                    orgId: organization._id
                });
            }
        });
    }

    if(event?.event=='Org:Deleted'){
        const { organization, members } = event;
        members.forEach((member) => {
                const room = `user:${member}`;
                io.to(room).emit("notification", {
                    message: `${organization.name} Has Been deleted`,
                    orgId: organization._id
                });
        });
    }

    if(event?.event=='Space:MembersAdd'){
        const {space,members}=event;
        members.forEach((member)=>{
             const room=`user:${member}`;
             io.to(room).emit("notification",{
                 message: `You Have Been Invited to Join Sapce ${space.name}`,
                 spaceId:space._id
             })
        });
    }

    if(event?.event=='Space:MembersDelete'){
        const {space,members}=event;
         members.forEach((member)=>{
             const room=`user:${member}`;
             io.to(room).emit("notification",{
                 message: `You Have Been Removed from Spcce ${space.name}`,
                 spaceId:space._id
             })
        });
    }

    if(event?.event=='Space:Deleted'){
          const {space,members}=event;
         members.forEach((member)=>{
             const room=`user:${member}`;
             io.to(room).emit("notification",{
                 message: ` Space ${space.name} have been deleted`,
                 spaceId:space._id
             })
        });
    }

});


subscriber.subscribe("task.events",(message)=>{
    const event=JSON.parse(message);
    console.log(event);
    if(event?.event=="task.status.changed"){
        console.log("Task has been updated");
    }
});



io.on("connection", (socket) => {
    const { userId } = socket.user;
    socket.join(`user:${userId}`);
    console.log(`✅ User ${userId} joined private room`);
});



httpServer.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
})