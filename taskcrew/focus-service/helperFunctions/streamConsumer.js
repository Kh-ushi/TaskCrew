import redisClient from "../redis/redisClient.js";
import ProjectSnapshot from "../models/ProjectSnapshot.js";
import TaskSnapshot    from "../models/TaskSnapshot.js";
import { computePrioritiesForUser } from "./utilFunctions.js";

const GROUP    = "focus-service-group";
const CONSUMER = "consumer-1";

async function ensureGroup(stream) {
  try {
    await redisClient.xGroupCreate(stream, GROUP, "0", { MKSTREAM: true });
  } catch (e) {
    if (!e.message.includes("BUSYGROUP")) throw e;
  }
}

export async function startConsumer() {
  await ensureGroup("project:changes");
  await ensureGroup("task:changes");

  while (true) {
    let streams;
    try {
      streams = await redisClient.xReadGroup(
        GROUP,
        CONSUMER,
        [
          { key: "project:changes", id: ">" },
          { key: "task:changes",    id: ">" }
        ],
        {
          COUNT: 10,
          BLOCK: 5000
        }
      );
    } catch (err) {
      console.error("xReadGroup failed:", err);
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    if (!streams) {
      // no new messages
      continue;
    }

    for (const { name: stream, messages } of streams) {
      for (const { id, message } of messages) {
        // normalize fields
        const data = {};
        for (const [key, value] of Object.entries(message)) {
          if (key === "members" || key === "assignedTo") {
            data[key] = JSON.parse(value);
          } else if (key === "deleted") {
            data.deleted = value === "true";
          } else if (["startDate","endDate","updatedAt","endTime"].includes(key)) {
            data[key] = value ? new Date(value) : null;
          } else {
            data[key] = value;
          }
        }

        try {
          if (stream === "project:changes") {
            if (data.deleted) {
              await ProjectSnapshot.deleteOne({ _id: data._id });
            } else {
              await ProjectSnapshot.updateOne(
                { _id: data._id },
                { $set: data },
                { upsert: true }
              );
            }
            await redisClient.xAck("project:changes", GROUP, id);

          } else {
            if (data.deleted) {
              await TaskSnapshot.deleteOne({ _id: data._id });
            } else {
              await TaskSnapshot.updateOne(
                { _id: data._id },
                { $set: data },
                { upsert: true }
              );
            }
            await redisClient.xAck("task:changes", GROUP, id);
          }

          // recompute priorities
          const users = stream === "project:changes"
            ? [data.ownerId, ...(data.members || [])]
            : (data.assignedTo || []);

          for (const u of users) {
            computePrioritiesForUser(u).catch(console.error);
          }

        } catch (e) {
          console.error(`Error handling ${stream} entry ${id}:`, e);
          // leave unacked so it can be retried
        }
      }
    }
  }
}
