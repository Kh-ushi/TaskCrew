
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

        const {userId}=req.user;

        await redisClient.publish("task:assigned",JSON.stringify({
            userId,
            taskId:task._id,
            title: `New task: ${task.title}`,
            watchers:projectId.assignedTo,
            data: { taskId: task._id, projectId: task.projectId }
        }));

        res.status(201).json(task);
    }
    catch (error) {
        console.error("Error has Ocuured while creating taks", error.message);
        res.status(500).json({ msg: "Failed to create task" });
    }


};


const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task", error: error.message });
    }

};


const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ projectId }).sort({ dueDate: 1, updatedAt: -1 });
        res.status(201).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

const getMyTasks = async (req, res) => {

    try {
        const userId = req.user.userId;
        const tasks = await Task.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] }).sort({ dueDate: 1 });
        res.status(201).json(tasks);
    }
    catch (error) {
        console.error("Failed to fetch your tasks", error.message);
        res.status(500).json({ message: "Failed to fetch your tasks", error: error.message });
    }

};

const updateTask = async (req, res) => {
    try {
        const updates = req.body;
        const { taskId } = req.params;
        const {userId}=req.user;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // if (task.createdBy !== req.user.userId) {
        //     return res.status(403).json({ msg: "Not authorized" });
        // }

        Object.assign(task, updates);
        await task.save();
         
        await redisClient.publish("task:updated",JSON.stringify({
              userId,
              taskId,
              title:`${task.title} has been updated,pls check`,
              watchers:assignedTo,
              data: { taskId: task._id}
        }));

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {

        const { taskId } = req.params;
        const {userId}=req.user;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        // if (task.createdBy !== req.user.userId) {
        //     return res.status(403).json({ msg: "Not authorized" });
        // }

        await Task.findByIdAndDelete(req.params.id);
        await redisClient.publish("task:deleted",JSON.stringify)({
            userId,
            taskId,
            title:`${task.title} has been deleted`
        });
        res.status(201).json({ task, message: "Task has been successfully deleted" });

    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};

export { createTask, getTasksByProject, getMyTasks, getTaskById, updateTask,deleteTask};