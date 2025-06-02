const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  skillTags:   [{ type: String }], 
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['pending','inProgress','done'], default: 'pending' },
  priority:    { type: String, enum: ['high','medium','low'], default: 'medium' },
  dueDate:     { type: Date },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
