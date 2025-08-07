import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
   
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decoded.userId || decoded.id;
      console.log('Token decoded - userId:', userId);
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        console.error('User not found for token:', userId);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
     
      req.user = user;
      console.log('User attached to request:', req.user._id, 'Role:', req.user.role);
      next();
    } catch (error) {
      console.error('Error authenticating token:', error);
      res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  } else {
    console.error('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    console.log('Admin access granted for user:', req.user._id);
    next();
  } else {
    console.log('Admin access denied for user:', req.user ? req.user._id : 'unknown', 'Role:', req.user ? req.user.role : 'none');
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
