import Razorpay from 'razorpay';
import crypto from 'crypto';
import Book from '../models/Book.js';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const createRazorpayOrder = async (req, res) => {
  try {
    const { bookId, amount } = req.body;
    
    let orderAmount = amount;
    
  
    if (bookId && !amount) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      orderAmount = book.price * 100;
    }
    

    if (!orderAmount) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    
    const options = {
      amount: orderAmount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
      notes: {
        bookId: bookId || 'direct_payment',
        userId: req.user._id.toString()
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Error creating payment order', error: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
 
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      orderData: order
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};
