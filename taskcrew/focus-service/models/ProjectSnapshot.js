import mongoose from 'mongoose';

const projectSnapshotSchema = new mongoose.Schema({
    _id: {
        type: String,
        description: 'Project (primary key)',
    },
    name: {
        type: String,
        required: true,
        description: 'Human‐readable project name',
    },
    ownerId: {
        type: String,
        required: true,
    },
    members: {
        type: [String],
        default: [],
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        description: 'Latest time this snapshot was applied',
    },
}, {
    _id: false,
    timestamps: false,

});

export default mongoose.model('ProjectSnapshot', projectSnapshotSchema);