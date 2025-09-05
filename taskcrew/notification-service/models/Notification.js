import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    channels: { type: [String], default: ["inApp"] },
    isRead: { type: Boolean, default: false },
    isJoin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);