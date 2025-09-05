import {createClient} from "redis";
import dotenv from "dotenv";

dotenv.config();

const subscriber=createClient({url:process.env.REDIS_URL});

const connectSubscriber=async()=>{
    try{
        await subscriber.connect();
        console.log("Redis Subscriber connected successfully");
    }catch(error){
        console.error("Error connecting Redis Subscriber:", error); 
        process.exit(1);
    }
};

connectSubscriber();

export default subscriber;