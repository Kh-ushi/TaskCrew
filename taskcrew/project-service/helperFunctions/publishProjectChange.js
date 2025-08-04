import redisClient from "../redis/redisClient.js";
import crypto from "crypto";


const publishProjectChange = async (project,action) => {

    const payload={
        projectId: project._id.toString(),
        ownerId:project.ownerId.toString(),
        members: JSON.stringify(project.members || []),
        startDate: project.startDate ? new Date(project.startDate).toISOString() : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString() : "",
        action: action,
         version: String(Date.now()),
    }

    await redisClient.xAdd("project:changes", "*", payload);
}


const publishInvite = async ({ projectId, inviteId, email }) => {
    const message = {
        projectId,
        inviteId,
        email,
        timeStamp: Date.now(),
        correlationId: crypto.randomUUID(),
    }
    console.log("Publishing invite message to Redis:", message);
    await redisClient.publish("project:invite", JSON.stringify(message));
};

export {publishProjectChange, publishInvite};