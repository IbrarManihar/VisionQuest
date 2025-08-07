import Order from '../models/Order.js';
import Book from '../models/Book.js';


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('bookId')
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user._id;
    console.log('Fetching orders for user:', userId);

    const orders = await Order.find({
      $or: [
        { userId: userId },
        { userId: userId.toString() }
      ]
    })
    .populate('bookId')
    .sort({ orderDate: -1 });
    
    console.log(`Found ${orders.length} orders for user ${userId}`);
    
  
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order._id,
        userId: order.userId,
        bookName: order.bookId ? order.bookId.name : 'No book data',
        status: order.status
      });
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('bookId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }
    
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed order' });
    }
    

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || 'No reason provided';
    
    await order.save();
    
  
    if (order.bookId) {
      const book = await Book.findById(order.bookId);
      if (book) {
        book.available = true;
        await book.save();
      }
    }
    
    res.status(200).json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};



