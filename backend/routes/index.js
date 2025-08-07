import express from 'express';
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import bookRoutes from './bookRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import eventRoutes from './eventRoutes.js';
import scheduleRoutes from './scheduleRoutes.js';
import studyMaterialRoutes from './studyMaterialRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', orderRoutes);
router.use('/', bookRoutes);
router.use('/', paymentRoutes);
router.use('/', adminRoutes);
router.use('/', userRoutes);
router.use('/', eventRoutes);
router.use('/', scheduleRoutes);
router.use('/', studyMaterialRoutes);
router.use('/upload', uploadRoutes);

router.get('/health', async (req, res) => {
  try {

    if (mongoose.connection.readyState === 1) {
      return res.status(200).json({ 
        status: 'ok',
        mongodb: 'connected',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date()
      });
    } else {
      return res.status(500).json({ 
        status: 'error', 
        mongodb: 'disconnected', 
        readyState: mongoose.connection.readyState 
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
