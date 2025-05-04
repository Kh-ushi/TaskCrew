const mongoose=require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image:{
      type:String
    },
    createdBy: {
      type:String
    },
    teamMembers: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold"],
      default: "Active",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      }
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low","Low","medium", "Medium", "high","High"],
      default: "Medium",
    },
    chatRoomId: {
      type: String,
      default: null, // Can be used for project-based team chat
    },
    recommendedNextSteps: {
      type: [String], // Populated by AI
      default: [],
    },
    analytics: {
      completedTasks: { type: Number, default: 0 },
      pendingTasks: { type: Number, default: 0 },
      overdueTasks: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports=Project;

