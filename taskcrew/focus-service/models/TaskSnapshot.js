import mongoose from 'mongoose';

const taskSnapshotSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true,
        index: true
    },
    assignedTo: {
        type: [String],
        default: [],
        index: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    startTime: Date,
    endTime: Date,
    updatedAt: Date
}, {
    versionKey: false
});

// const highPrioCount = await TaskSnapshot.countDocuments({
//   projectId: snap._id,
//   assignedTo: userId,
//   priority: 'High',
//   status: { $ne: 'done' }
// });
// const recentCount = await TaskSnapshot.countDocuments({
//   projectId: snap._id,
//   assignedTo: userId,
//   updatedAt: { $gte: dayjs().subtract(6, 'hour').toDate() }
// });

export default mongoose.model('TaskSnapshot', taskSnapshotSchema);
