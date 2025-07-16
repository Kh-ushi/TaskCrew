import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ownerId: { type: String, required: true },
  members: [String],
  status: { type: String, enum: ["active", "archived"], default: "active" },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
