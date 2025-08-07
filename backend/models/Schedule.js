import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Schedule', scheduleSchema);
