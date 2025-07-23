import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
},
  {
    timestamps: { createdAt: true, updatedAt: false },
    _id: true
  }
);

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  dueDate: Date,
  assignedTo: [String],
  tags: [String],
  comments:[commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}, { _id: true });



const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: [String],
  createdBy: { type: String, required: true },

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  dueDate: Date,

  subtasks: [subtaskSchema]
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema)

export default Task;