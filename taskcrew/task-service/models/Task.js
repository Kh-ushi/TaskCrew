import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
}, { _id: true });



const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: [String], // list of userIds
  createdBy: { type: String, required: true },

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  dueDate: Date,

  subtasks: [subtaskSchema]
}, { timestamps: true });

const Task=mongoose.model("Task", taskSchema)

export default Task;