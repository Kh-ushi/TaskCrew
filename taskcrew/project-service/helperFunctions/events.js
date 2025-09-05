
import redisClient from "../redis/redisClient.js";
import crypto from "node:crypto";

const emitEvent=async(type,{spaceId="",projectId="",taskId="",data={}})=>{
const evt={
    eventId:crypto.randomUUID(),
    type,
    spaceId,
    projectId,
    taskId,
    data,
    ts: Date.now()
};

console.log("Emitting event:", evt);

await redisClient.publish("events", JSON.stringify(evt));

}

export{emitEvent};