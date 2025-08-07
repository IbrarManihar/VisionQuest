import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
  
    if (newPassword && !await user.comparePassword(currentPassword)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
  
    if (name) user.name = name;
    
   
    if (newPassword) {
      user.password = newPassword;
    }
    
    await user.save();
  
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};
