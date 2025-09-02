import redisClient from "../redis/redisClient.js";
import ProjectSnapshot from "../models/ProjectSnapshot.js";

const STREAM_KEY = "project:changes";
const GROUP_NAME = "project-snapshoters";
const CONSUMER_NAME = `task-service-${process.pid}`;

const ensureGroup = async () => {
    try {
        await redisClient.xGroupCreate(STREAM_KEY, GROUP_NAME, "0", { MKSTREAM: true });
    } catch (e) {
        if (!e.message.includes("BUSYGROUP")) {
            console.error("Failed to create consumer group:", e);
        }
    }
};

const processProjectChange = async (entryId, fieldsArray) => {

    try {
        const data = {};
        for (let i = 0; i < fieldsArray.length; i += 2) {
            data[fieldsArray[i]] = fieldsArray[i + 1];
        }

        const {
            projectId,
            ownerId,
            members,
            startDate,
            endDate,
            action,
        } = data;

        if (action == "deleted") {
            await ProjectSnapshot.deleteOne({ _id: projectId });
        }
        else {
            await ProjectSnapshot.updateOne(
                { _id: projectId },
                {
                    _id: projectId,
                    ownerId,
                    members: members ? JSON.parse(members) : [],
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    updatedAt: new Date(),
                }, {
                upsert: true
            });
        }

        await redisClient.xAck(STREAM_KEY, GROUP_NAME, entryId);
    }
    catch (error) {
        console.error("Error processing space change event:", err);
    }
}


const startProjectSnapShotConsumer = async () => {
  await ensureGroup();
  (async function loop() {
    while (true) {
      try {
        const resp = await redisClient.xReadGroup(
          GROUP_NAME,
          CONSUMER_NAME,
          [{ key: STREAM_KEY, id: ">" }],
          { COUNT: 10, BLOCK: 5000 }
        );
        if (!resp) continue;

        // CHANGE: node-redis v4 returns [{ name, messages: [{ id, message }] }]
        for (const { name, messages } of resp) {
          for (const { id, message } of messages) {
            await processProjectChange(id, message); // 'message' is the fields object
            await redisClient.xAck(name, GROUP_NAME, id); // ack after success
          }
        }
      } catch (e) {
        console.error("Stream consumer loop error:", e);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  })();
};


export {startProjectSnapShotConsumer};

