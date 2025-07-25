import dotenv from "dotenv";
import { createClient } from "redis";
import Notification from "../models/Notification";

dotenv.config();

const startSubscriber =async() => {

    const sub = createClient({ url: process.env.REDIS_URL });
    try {
        await sub.connect();
    } catch (error) {
        console.error("Failed to reconnect with redis", error);
        process.exit(1);
    }

    const channels = [
        "project:created",
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

    for (ch of channels) {

        sub.subscribe(ch, async (msg) => {

            try {
                const evt = JSON.parse(msg);
                const recepients = evt.watchers || [];

                for (const userId of recepients) {
                    await Notification.create({
                        userId,
                        type: ch,
                        title: evt.title || `Event: ${ch}`,
                        message: evt.message || "",
                        data: evt,
                        channels: ["inApp", "email"]
                    });
                }

                console.log(`Notification(s) saved for event "${ch}"`);
            } catch (error) {
                console.error(`Error processing message on channel "${ch}":`, err);
            }
        });
    }

};


export { startSubscriber }