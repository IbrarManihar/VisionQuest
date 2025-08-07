import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['TextBooks', 'Syllabus', 'Previous Year Papers', 'Mid-Sem Papers', 'Notes']
  },
  semester: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('StudyMaterial', studyMaterialSchema);
