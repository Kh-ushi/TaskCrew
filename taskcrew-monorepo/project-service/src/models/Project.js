const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date },
    priority:{
        type:"String",
        enum:['high','medium','low'],
        default:'medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
