import mongoose from "mongoose";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import crypto from "crypto"; 
dayjs.extend(relativeTime);


const attachmentSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  contentType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
}, {
  _id: true
});

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  _id: true
});

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  dueDate: Date,
  assignedTo: [String],
  tags: [String],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
}, { _id: true });

// ----- Main Task Schema -----
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

 
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

  assignedTo: [{ type: String }], // user IDs/emails
  createdBy: { type: String, required: true },

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "Medium"
  },

  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  dueDate: Date, 

  subtasks: [subtaskSchema],
  attachments: [attachmentSchema],


  subtaskProgress: {
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 }, 
  },

}, { timestamps: true });


taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ startTime: 1, endTime: 1 });
taskSchema.index({ "subtasks.isCompleted": 1 }); 


taskSchema.pre("save", function (next) {
  if (!this.isModified("subtasks")) {
    return next();
  }

  const total = this.subtasks.length;
  const completed = this.subtasks.filter(st => st.isCompleted).length;
  const percent = total === 0
    ? (this.status === "done" ? 100 : 0)
    : Math.round((completed / total) * 100);

  this.subtaskProgress = { completed, total, percent };


  if (total > 0 && completed === total && this.status !== "done") {
    this.status = "done";
  }

  next();
});


taskSchema.methods.recomputeSubtaskProgress = function () {
  const total = this.subtasks.length;
  const completed = this.subtasks.filter(st => st.isCompleted).length;
  const percent = total === 0
    ? (this.status === "done" ? 100 : 0)
    : Math.round((completed / total) * 100);

  this.subtaskProgress = { completed, total, percent };
  if (total > 0 && completed === total && this.status !== "done") {
    this.status = "done";
  }
};


taskSchema.virtual("durationMs").get(function () {
  if (this.startTime && this.endTime) {
    return this.endTime - this.startTime;
  }
  return 0;
});


taskSchema.methods.isOverdue = function () {
  const now = new Date();
  return this.status !== "done" && this.endTime && now > this.endTime;
};

const Task = mongoose.model("Task", taskSchema);
export default Task;
