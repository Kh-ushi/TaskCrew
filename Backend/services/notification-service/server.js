import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import subscriber from "./redis/subscriber.js";
import Notification from "./models/Notification.js";
import connectDb from "./config/db.js";
import notifRoutes from "./routes/notif.route.js";


dotenv.config();
const app = express();
const httpServer = createServer(app);
const { PORT, JWT_SECRET } = process.env;


app.use(cors({origin:true,credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/notifications", notifRoutes);



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


subscriber.subscribe("notifications", async (message) => {
    const event = JSON.parse(message);
    console.log(event);

    if (event?.event == 'Org:MembersAdded') {
        const { organization, members } = event;
        for (const member of members) {
            if (member.toString() !== organization.owner.toString()) {
                const room = `user:${member}`;
                console.log("Emitting to room:", room);
                io.to(room).emit("notification", {
                    message: `You Have Been Invited to Join ${organization.name}`,
                    orgId: organization._id
                });

            }
            const notif = await Notification.create({
                recipient: member,
                message: `You Have Been Invited to Join ${organization.name}`,
                type: "Org:MembersAdded",
                entity: organization._id,
                entityModel: "Organization"
            });
            console.log("Notification created:", notif);
        }
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

    if (event?.event == 'Org:Deleted') {
        const { organization, members } = event;
        members.forEach((member) => {
            const room = `user:${member}`;
            io.to(room).emit("notification", {
                message: `${organization.name} Has Been deleted`,
                orgId: organization._id
            });
        });
    }

    if (event?.event == 'Space:MembersAdd') {
        const { space, members } = event;
        members.forEach((member) => {
            const room = `user:${member}`;
            io.to(room).emit("notification", {
                message: `You Have Been Invited to Join Sapce ${space.name}`,
                spaceId: space._id
            })
        });
    }

    if (event?.event == 'Space:MembersDelete') {
        const { space, members } = event;
        members.forEach((member) => {
            const room = `user:${member}`;
            io.to(room).emit("notification", {
                message: `You Have Been Removed from Spcce ${space.name}`,
                spaceId: space._id
            })
        });
    }

    if (event?.event == 'Space:Deleted') {
        const { space, members } = event;
        members.forEach((member) => {
            const room = `user:${member}`;
            io.to(room).emit("notification", {
                message: ` Space ${space.name} have been deleted`,
                spaceId: space._id
            })
        });
    }

});


subscriber.subscribe("task.events", (message) => {
    const event = JSON.parse(message);
    console.log(event);
    if (event?.event == "task.status.changed") {
        console.log("Task has been updated");
    }
});



io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.user);
    const { userId } = socket.user;
    const room = `user:${userId}`;
    socket.join(room);
    console.log(`✅ User ${userId} joined private room ${room}`);
});



httpServer.listen(PORT, async () => {

    try {
        await connectDb();
        console.log(`🚀 Notification Service running on port ${PORT}`);
    }
    catch (error) {
        console.error("Failed to connect to database:", error.message);
        process.exit(1);
    }
});