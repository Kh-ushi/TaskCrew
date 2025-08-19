import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["admin", "member", "viewer"], default: "member" },
        addedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const SpaceSchema = new mongoose.Schema(
    {
        orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },

        name: { type: String, required: true, trim: true },
        slug: { type: String, trim: true }, // unique per org, generated from name

        description: { type: String, default: "" },
        icon: { type: String, default: "" },   // e.g., "📦" or icon key

        visibility: { type: String, enum: ["org", "private"], default: "org" },

        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        members: { type: [MemberSchema], default: [] },
        settings: {
            allowGuests: { type: Boolean, default: true },
            whoCanCreateSpaces: { type: String, enum: ["admins", "members"], default: "admins" },
            defaultTaskStatuses: {
                type: [String],
                default: ["todo", "in-progress", "review", "done"]
            }
        },

        limits: {
            maxProjects: { type: Number, default: 10 },
            maxMembers: { type: Number, default: 50 }
        },

        stats: {
            spaceCount: { type: Number, default: 0 },
            activeTasks: { type: Number, default: 0 }
        },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

SpaceSchema.pre("validate", function (next) {

    if (!this.slug && this.name) {
        this.slug =
            this.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/(^-|-$)/g, "");


    }
    next();
});

SpaceSchema.index({ orgId: 1, name: 1 }, { unique: true });
SpaceSchema.index({ orgId: 1, slug: 1 }, { unique: true });

SpaceSchema.methods.ensureOwnerMember = function () {
    if (!this.members.some(member => member.userId.toString() === this.ownerId.toString())) {
        this.members.push({ userId: this.ownerId, role: "admin", addedAt: Date.now() });
    }
};



export default mongoose.model("Space", SpaceSchema);