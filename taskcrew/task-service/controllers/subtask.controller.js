import Task from '../models/Task';


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
        const { title } = req.body;
        if (!title) return res.status(400).json({ msg: "Subtask title is required" });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        task.subtasks.push({ title });
        await task.save();

        res.status(201).json(task.subtasks);
    }
    catch (err) {
        res.status(500).json({ msg: "Failed to add subtask", error: err.message });
    }
};

const updateSubTask = async (req, res) => {

    try {
        const { taskId, subtaskId } = req.params;
        const { title, isCompleted } = req.body;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ msg: "Subtask not found" });

        if (title !== undefined) subtask.title = title;
        if (isCompleted !== undefined) subtask.isCompleted = isCompleted;

        await task.save();
        res.status(201).json(task.subtasks);
    }
    catch (error) {
        console.log("Failed to update subtask", error.message);
        res.status(500).json({ message: "Failed to update subtask", error: error.message });
    }

}

const deleteSubTask = async (req, res) => {
    try {
        const { taskId, subtaskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).json({ msg: "Subtask not found" });

        subtask.remove();
        await task.save();

        res.json({ message: "Subtask deleted", task });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete subtask", error: err.message });
    }
}

export { getSubtasks, addSubTask, updateSubTask, deleteSubTask };