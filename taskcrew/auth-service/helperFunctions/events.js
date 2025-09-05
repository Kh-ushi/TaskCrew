import redisClient from "../redis/redisClient.js";
import crypto from "node:crypto";

const emitEvent=async(type,{organizationId="",spaceId="",projectId="",taskId="",data={}})=>{
const evt={
    eventId:crypto.randomUUID(),
    type,
    organizationId,
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