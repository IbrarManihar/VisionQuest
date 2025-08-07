import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


const logAuthStatus = (req, res, next) => {
  console.log('Authentication check - User:', req.user ? 
    `ID: ${req.user._id}, Name: ${req.user.name}` : 'Not authenticated');
  next();
};

router.get('/orders', protect, admin, orderController.getAllOrders);

router.get('/orders/my', protect, logAuthStatus, orderController.getUserOrders);

router.put('/orders/:id', protect, admin, orderController.updateOrderStatus);

router.put('/orders/:id/cancel', protect, orderController.cancelOrder);

export default router;
