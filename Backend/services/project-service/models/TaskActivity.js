import mongoose from "mongoose";

const taskActivitySchema = new mongoose.Schema({

    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", index: true },
    actorId: { type: "String" },
    type: { type: String, index: true },     // 'task.created' | 'task.updated' | 'task.status.changed' | 'task.completed'
    from: String,
    to: String,
    fieldsChanged: [String],
    createdAt: { type: Date, default: Date.now, index: true }
});

const TaskActivity=mongoose.model("TaskActivity",taskActivitySchema);

export default TaskActivity;