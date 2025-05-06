const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Team = require("./Team");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password:
    {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: '/avatars/default.png',
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },

    joinedProjects: [
        {
            type: String
        }
    ],

    memberOfTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],

    performanceStats: {
        totalTasksAssigned: { type: Number, default: 0 },
        tasksCompleted: { type: Number, default: 0 },
        averageCompletionTime: { type: Number, default: 0 }, // in hours or days
        overdueTasks: { type: Number, default: 0 },
        punctualityScore: { type: Number, default: 0 }, // 0–100, computed based on deadlines met
    },

    skills: [
        {
            name: { type: String },
            level: { type: String, enum: ["beginner", "intermediate", "expert"] },
            confidence: { type: Number, min: 0, max: 100 } // from system learning or manual rating
        }
    ],

    recommendedForProjects: [
        {
            projectId: { type: String },
            reason: { type: String }
        }
    ]



},
    { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model("User", userSchema);
