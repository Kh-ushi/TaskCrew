const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['pending','in-progress','done'], default: 'pending' },
  priority:    { type: String, enum: ['High','Medium','Low'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
