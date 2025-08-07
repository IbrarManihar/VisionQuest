import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);


router.get('/verify', protect, authController.verifyToken);

export default router;
