import Razorpay from 'razorpay';

class RazorpayService {
  constructor() {
  
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('⚠️ RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables');
    }
    
    console.log('Initializing Razorpay with Key ID:', process.env.RAZORPAY_KEY_ID ? 
      `${process.env.RAZORPAY_KEY_ID.substring(0, 4)}...` : 'undefined');
    
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(amount, options = {}) {
    try {
      const order = await this.razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: options.currency || 'INR',
        receipt: options.receipt || `receipt_${Date.now()}`,
        notes: options.notes || {}
      });
      
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
    
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback order in development mode');
        return {
          id: 'order_fallback_' + Date.now(),
          amount: Math.round(amount * 100),
          currency: options.currency || 'INR',
          receipt: options.receipt || `receipt_${Date.now()}`,
          status: 'created'
        };
      }
      
      throw error;
    }
  }

  async verifyPayment(paymentId, orderId, signature) {
    try {

      const text = orderId + "|" + paymentId;

      const crypto = await import('crypto');
      const generatedSignature = crypto.default
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');
     
      return generatedSignature === signature;
    } catch (error) {
      console.error('Razorpay payment verification error:', error);
      throw error;
    }
  }
}

export default new RazorpayService();
