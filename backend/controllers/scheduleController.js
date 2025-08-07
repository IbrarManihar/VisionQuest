import Schedule from '../models/Schedule.js';

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

export const addSchedule = async (req, res) => {
  try {
    const { title, branch, semester } = req.body;
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const newSchedule = new Schedule({
      title,
      branch,
      semester,
      fileUrl: req.file.path
    });
    
    await newSchedule.save();
    res.status(201).json({ message: 'Schedule added successfully', schedule: newSchedule });
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ message: 'Error adding schedule' });
  }
};
