import Task from '../models/Task';
import redisClient from '../redis/redisClient';

const getSubtasks = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).select("subtasks");
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(201).json(task.subtasks);
    } catch (error) {
        console.error("Failed to list subtasks:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const addSubTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { userId } = req.user;
        const { title, dueDate, assignedTo = [], tags = [] } = req.body;
        if (!title) return res.status(400).json({ msg: "Subtask title is required" });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        task.subtasks.push({ title, dueDate, assignedTo, tags });
        await task.save();

        const newSubtask = task.subtasks.findOne(title);

        await redisClient.publish("subtask:created", JSON.stringify({
            userId,
            taskId,
            subtaskId: newSubtask._id,
            title: `New subtask: ${newSubtask.title}`,
            watchers: task.assignedTo,
            data: { taskId, subtaskId: newSubtask._id }
        }));

        res.status(201).json(task.subtasks);
    }
    catch (err) {
        res.status(500).json({ msg: "Failed to add subtask", error: err.message });
    }
};

const updateSubTask = async (req, res) => {

    try {
        const { taskId, subTaskId } = req.params;
        const { userId } = req.user;

        const { title, isCompleted, dueDate, assignedTo, tags } = req.body;
        const updates = { title, isCompleted, dueDate, assignedTo, tags };

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const subtask = task.subtasks.id(subTaskId);
        if (!subtask) return res.status(404).json({ msg: "Subtask not found" });

        Object.entries(updates).forEach(([k, v]) => {
            if (v !== undefined) subtask[k] = v;
        });

        await task.save();

        await redisClient.publish("subtask:updated", JSON.stringify({
            userId,
            taskId,
            subtaskId: subTaskId,
            title: `Subtask Updated:${subtask.title}`,
            watchers: task.assignedTo,
            data: { taskId, subTaskId }
        }));
        res.status(201).json(task.subtasks);
    }
    catch (error) {
        console.log("Failed to update subtask", error.message);
        res.status(500).json({ message: "Failed to update subtask", error: error.message });
    }

}

const deleteSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;
        const { userId } = req.user;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const subtask = task.subtasks.id(subTaskId);
        if (!subtask) return res.status(404).json({ msg: "Subtask not found" });

        subtask.remove();
        await task.save();

        await redisClient.publish("subtask:deleted", JSON.stringify({
            userId,
            taskId,
            subtaskId: subTaskId,
            title: `Subtask deleted:${subtask.title}`,
            watchers: task.assignedTo,
            data: { taskId, subTaskId }
        }));

        res.json({ message: "Subtask deleted", task });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete subtask", error: error.message });
    }
};

const reorderSubTasks = async (req, res) => {
    try {

        const { taskId } = req.params;
        const { order } = req.body;

        if (!Array.isArray(order)) {
            return res.status(400).json({ message: "Order must be an array of subtask IDs" });
        }

        const task = await Task.findById(taskId);
        if (!task) { return res.status(404).json({ message: "Task not found" }) };

        const newOrder = order.map((id) => {
            const sub = task.subtasks.id(id);
            if (!sub) throw new Error(`Invalid subtask ID: ${id}`);
            return sub;
        });

        task.subtasks = newOrder;
        await task.save();

        res.status(201).json(task.subtasks);

    } catch (error) {
        console.error("Failed to reorder subtasks:", error.message);
        res.status(400).json({ message: error.message });
    }
};


const addComment = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;
        const { content } = req.body;
        const { userId } = req.user;

        if (!content) return res.status(400).json({ message: "Content required" });
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const subtask = task.subtasks.id(subTaskId);
        if (!subtask) return res.status(404).json({ message: "Subtask not found" });

        subtask.comments.push({ userId, content });
        await task.save();

        await redisClient.publish(`comment:added`, JSON.stringify({
            userId,
            taskId,
            subtaskId: subTaskId,
            title: `Comment added`,
            watchers: task.assignedTo,
            data: { taskId, subTaskId }
        }));
        res.status(201).json(sub.comments);
    }
    catch (error) {
        console.error("Failed to add comment:", error.message);
        res.status(400).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {

    try {
        const { taskId, subTaskId, commentId } = req.params;
        const { userId } = req.user;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const subtask = task.subtasks.id(subTaskId);
        if (!subtask) return res.status(404).json({ message: "SubTask not found" });

        const comment = subtask.comments.id(commentId);
        if (!comment) return res.status(404).json({ msg: "Comment not found" });

        comment.remove();
        await task.save();

        await redisClient.publish(`comment:removed`, JSON.stringify({
            userId,
            taskId,
            subtaskId: subTaskId,
            title: `Comment removed`,
            watchers: task.assignedTo,
            data: { taskId, subTaskId }
        }));

        res.status(201).json(sub.comments);



    }
    catch (error) {
        console.error("Failed to delete comment:", error.message);
        res.status(400).json({ message: error.message });
    }

};



export { getSubtasks, addSubTask, updateSubTask, deleteSubTask, reorderSubTasks, addComment, deleteComment };