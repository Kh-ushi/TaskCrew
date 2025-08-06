import redisClient from "../redis/redisClient.js";

const publishTaskChange = async (task, action) => {
    const payload = {
        taskId: task._id.toString(),
        projectId: task.projectId.toString(),
        assignedTo: JSON.stringify(task.assignedTo),
        priority: task.priority,
        status: task.status,
        endTime: task.endTime?.toISOString() || '',
        updatedAt: (new Date()).toISOString(),
        action: action,
        version: String(Date.now()),
    };
    await redisClient.xAdd("task:changes", "*", payload);
};

export { publishTaskChange };