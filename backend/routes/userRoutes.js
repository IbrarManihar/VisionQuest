import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/users', protect, admin, userController.getAllUsers);
router.get('/users/profile', protect, userController.getUserProfile);
router.put('/users/profile', protect, userController.updateUserProfile);

export default router;
