import mongoose from "mongoose";

const userProjectFocusSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        description: 'The ID of the user',
    },
    projectId: {
        type: String,
        required: true,
        index: true,
        description: 'The ID of the project',
    },
    lastViewedAt: {
        type: Date,
        default: Date.now,
        description: 'When the user last opened/viewed this project',
    },
    pinned: {
        type: Boolean,
        default: false,
        description: 'User has explicitly pinned this project',
    },
    priorityScore: {
        type: Number,
        default: 0,
        description: 'Computed urgency (0–100)',
    },
    isOverloaded: {
        type: Boolean,
        default: false,
        description: 'True if user is juggling too many high-urgency projects',
    },
}, {
    timestamps: true,
});

userProjectFocusSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export default mongoose.model('UserProjectFocus', userProjectFocusSchema);