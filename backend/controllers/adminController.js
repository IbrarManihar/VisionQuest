import Order from '../models/Order.js';
import User from '../models/User.js';
import Book from '../models/Book.js';


export const getStatistics = async (req, res) => {
  try {
   
    const totalOrders = await Order.countDocuments({});
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
  
    const orders = await Order.find({ status: 'completed' }).populate('bookId');
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.bookId ? order.bookId.price : 0);
    }, 0);
    
   
    const totalUsers = await User.countDocuments({});
    const totalBooks = await Book.countDocuments({});
    const availableBooks = await Book.countDocuments({ available: true });
    
    res.status(200).json({
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      totalUsers,
      totalBooks,
      availableBooks
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    
    if (!['processing', 'shipped', 'delivered'].includes(deliveryStatus)) {
      return res.status(400).json({ message: 'Invalid delivery status value' });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    ).populate('bookId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: 'Error updating delivery status', error: error.message });
  }
};
