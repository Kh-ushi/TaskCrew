const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], default: [] },
  //   availability: {                        
  //   from: Date,
  //   to:   Date
  // },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

