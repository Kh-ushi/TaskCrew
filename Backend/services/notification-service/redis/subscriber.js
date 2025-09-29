import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on("error", (err) => {
    console.error("Redis Client Error", err);
});


const connectRedis = async () => {
    try {
        await subscriber.connect();
        console.log("Subscriber connected successfully");
    }
    catch (error) {
        console.error("Redis connection failed:", error.message);
        process.exit(1);
    }
};


connectRedis();

export default subscriber;