const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  completed: {
    type: Boolean,
    default: false,
  },
  user: {  // This field links the task to the user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
