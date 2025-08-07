import { cloudinary } from '../config/cloudinary.js';


export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
  
    res.status(200).json({ 
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};


export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
 
    const uploadResults = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    
    res.status(200).json(uploadResults);
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};
