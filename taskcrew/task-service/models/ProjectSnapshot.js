import mongoose from "mongoose";

const  projectSnapshotSchema = new mongoose.Schema({
  _id: String,
  ownerId: String,
  members: [String],
  startDate: Date,
  endDate: Date,
  updatedAt: Date,
});

export default mongoose.model("ProjectSnapshot", projectSnapshotSchema);