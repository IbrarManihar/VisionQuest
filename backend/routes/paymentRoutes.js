import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/payments/razorpay/create-order', protect, paymentController.createRazorpayOrder);
router.post('/payments/razorpay/verify', protect, paymentController.verifyRazorpayPayment);

router.get('/payments/razorpay/status', async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Razorpay API routes are configured correctly',
      keyIdPrefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 4) + '...' : 'undefined'
    });
  } catch (error) {
    console.error('Razorpay API test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Razorpay configuration failed',
      error: error.message
    });
  }
});

export default router;

