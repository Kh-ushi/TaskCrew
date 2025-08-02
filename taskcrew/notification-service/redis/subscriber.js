import dotenv from "dotenv";
// import { createClient } from "redis";
import Notification from "../models/Notification.js";
import redisClient from "./redisClient.js";

dotenv.config();

const startSubscriber =async() => {

    const sub =redisClient.duplicate();
    try {
        await sub.connect();
    } catch (error) {
        console.error("Failed to reconnect with redis", error);
        process.exit(1);
    }

    const channels = [
        "project:invite",
        "project:membersAdded",
        "project:membersRemoved",
        "task:assigned",
        "task:updated",
        "task:deleted",
        "subtask:created",
        "subtask:updated",
        "subtask:deleted",
        "comment:added",
        "comment:removed",
        "attachment:added",
        "attachment:removed"
    ];

    for (const ch of channels) {

        sub.subscribe(ch, async (msg) => {

            try {
                const evt = JSON.parse(msg);
                const recepients = evt.watchers || [];

                console.log(`Received message on channel "${ch}":`, evt);

                // for (const userId of recepients) {
                //     await Notification.create({
                //         userId,
                //         type: ch,
                //         title: evt.title || `Event: ${ch}`,
                //         message: evt.message || "",
                //         data: evt,
                //         channels: ["inApp", "email"]
                //     });
                // }

                console.log(`Notification(s) saved for event "${ch}"`);
            } catch (error) {
                console.error(`Error processing message on channel "${ch}":`, err);
            }
        });
    }

};


export { startSubscriber }