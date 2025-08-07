import Event from '../models/Event.js';


export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};


export const addEvent = async (req, res) => {
  try {
    const { title, date, description, type } = req.body;
    
    const newEvent = new Event({
      title,
      date,
      description,
      type
    });
    
    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully', event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event' });
  }
};
