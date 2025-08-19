import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member", "client"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled", "trial"],
        default: "inactive",
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      renewalDate: {
        type: Date,
      },
    },

    settings: {
      allowGuests: {
        type: Boolean,
        default: true,
      },
      maxSpaces: {
        type: Number,
        default: 5, 
      },
    },

    spaces:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
        },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);
