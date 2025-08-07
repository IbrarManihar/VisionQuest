import Book from '../models/Book.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import PaymentService from '../services/PaymentService.js';
import RazorpayService from '../services/RazorpayService.js';


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};


export const addBook = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, semester, branch, price } = req.body;
    
 
    let photoUrl = '';
    if (!req.file) {
      console.log('No file uploaded or Cloudinary upload failed');
  
      photoUrl = 'https://res.cloudinary.com/demo/image/upload/v1580125392/samples/ecommerce/accessories-bag.jpg';
    } else {
      photoUrl = req.file.path;
    }

    const newBook = new Book({
      name,
      semester,
      branch,
      price: Number(price),
      photo: photoUrl,
      seller: req.user._id
    });

    await newBook.save();
    res.status(201).json({ message: 'Book listed successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

// Buy a book
export const buyBook = async (req, res) => {
  try {
    const { 
      bookId, 
      userName, 
      userSemester, 
      userBranch, 
      contactNumber,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      buyerNotes,
      userId 
    } = req.body;
    
 
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!book.available) {
      return res.status(400).json({ message: 'Book is no longer available' });
    }

    let paymentResult = {
      success: true,
      transactionId: paymentMethod === 'razorpay' && paymentDetails?.paymentId ? 
        paymentDetails.paymentId : 
        'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
      method: paymentMethod || 'cash',
      amount: book.price,
      timestamp: new Date()
    };
    
   
    book.available = false;
    await book.save();
    

    let userIdentifier = null;
    let isAnonymous = false;
    
    if (req.user && req.user._id) {
      userIdentifier = req.user._id;
      console.log('Creating order for authenticated user via middleware:', userIdentifier);
    } else if (userId && userId !== 'anonymous') {
      userIdentifier = userId;
      console.log('Creating order for user ID from request body:', userIdentifier);
    } else {
      isAnonymous = true;
      console.log('Creating anonymous order - no authenticated user found');
    }
    
 
    const orderData = {
      bookId: book._id,
      userId: !isAnonymous ? userIdentifier : undefined,
      isAnonymous: isAnonymous,
      userName,
      userSemester,
      userBranch,
      contactNumber: contactNumber || '0000000000', 
      shippingAddress: shippingAddress || 'Not provided',
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
      transactionId: paymentResult.transactionId,
      buyerNotes: buyerNotes || '',
      status: 'pending',
      deliveryStatus: 'processing',
      orderDate: new Date()
    };
    
    const order = new Order(orderData);
    await order.save();
    
 
    const populatedOrder = await Order.findById(order._id).populate('bookId');
    
    res.status(200).json({ 
      message: 'Book purchased successfully', 
      order: populatedOrder,
      payment: paymentResult,
      success: true
    });
  } catch (error) {
    console.error('Error buying book:', error);
    res.status(500).json({ message: 'Error buying book', error: error.message });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    const sellerBooks = await Book.find({ seller: req.user._id });
    const bookIds = sellerBooks.map(book => book._id);

    const orders = await Order.find({ bookId: { $in: bookIds } })
      .populate('bookId')
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .sort({ orderDate: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Error fetching seller orders', error: error.message });
  }
};


export const getAdminBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching all books:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};


export const updateBookAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryStatus, sellerNotes } = req.body;
    
    const order = await Order.findById(orderId).populate('bookId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const book = await Book.findById(order.bookId);
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (sellerNotes) order.sellerNotes = sellerNotes;
    
    await order.save();
    
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};






