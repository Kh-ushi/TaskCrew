import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true },
    members: [String],
    status: { type: String, enum: ["active", "archived"], default: "active" },
    state: { type: String, enums: ["to-do", "in-progress", "completed"], default: "to-do" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    spaceId: { type: String }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;