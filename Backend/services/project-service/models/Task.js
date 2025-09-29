import mongoose from "mongoose";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

const attachmentSchema = new mongoose.Schema({

    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true },
    contentType: String,
    size: Number,
    uplodadDate: { type: Date, default: Date.now }
}, {
    _id: true
});

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true }
}, {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true
});


const taskSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    title: { type: String, required: true },
    description: String,
    assignedTo: [{ type: String }],
    createdBy: { type: String, required: true },
    status: {
        type: String,
        enum: ["to-do", "in-progress", "done"],
        default: "todo"
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"]
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    completedAt: { type: Date, default: null },

    comments: [commentSchema],
    attachmens: [attachmentSchema]

}, { timestamps: true });

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ createdAt: 1 });


const Task = mongoose.model("Task", taskSchema);
export default Task;