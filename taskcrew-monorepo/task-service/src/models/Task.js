const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  skillTags:   [{ type: String }],
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['pending','inProgress','done'], default: 'pending' },
  priority:    { type: String, enum: ['high','medium','low'], default: 'medium' },
  dueDate:     { type: Date },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subtasks:    [SubtaskSchema],    
  estimation:  { minHours: Number, maxHours: Number },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

