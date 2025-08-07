import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/statistics', protect, admin, adminController.getStatistics);


router.get('/users', protect, admin, adminController.getAllUsers);

router.put('/orders/:id/delivery-status', protect, admin, adminController.updateDeliveryStatus);

export default router;
