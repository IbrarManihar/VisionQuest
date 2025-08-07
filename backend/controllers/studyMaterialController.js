import StudyMaterial from '../models/StudyMaterial.js';

export const getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ message: 'Error fetching study materials', error: error.message });
  }
};


export const addStudyMaterial = async (req, res) => {
  try {
    const { title, type, semester, branch } = req.body;
    
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: 'Both file and image are required' });
    }

    const fileUrl = req.files[0].path;
    const imageUrl = req.files[1].path;
    
    const studyMaterial = new StudyMaterial({
      title,
      type,
      semester,
      branch,
      fileUrl,
      imageUrl,
      uploadedBy: req.user._id
    });
    
    await studyMaterial.save();
    
    res.status(201).json({ 
      message: 'Study material added successfully',
      studyMaterial
    });
  } catch (error) {
    console.error('Error adding study material:', error);
    res.status(500).json({ message: 'Error adding study material', error: error.message });
  }
};


export const deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    

    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }
    
    await material.remove();
    
    res.status(200).json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ message: 'Error deleting study material', error: error.message });
  }
};
