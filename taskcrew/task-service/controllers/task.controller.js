
import Task from "../models/Task.js";
import redisClient from "../redis/redisClient.js";


const createTask = async (req, res) => {

    try {
        const { title, description, projectId, assignedTo, dueDate } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({ message: "Title and projectId required" });
        }

        const task = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            dueDate,
            createdBy: req.user.userId,
        });

        await redisClient.publish("task:created", JSON.stringify({
            taskId: task._id,
            projectId: task.projectId,
            assignedTo,
            title: task.title,
        }));

        res.status(201).json(task);
    }
    catch (error) {
        console.error("Error has Ocuured while creating taks", error.message);
        res.status(500).json({ msg: "Failed to create task" });
    }

};

export {createTask};