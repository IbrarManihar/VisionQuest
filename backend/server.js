import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import studyMaterialRoutes from './routes/studyMaterialRoutes.js';
import userRoutes from './routes/userRoutes.js';
import corsOptions from './cors-fix.js';
import { verifyCloudinaryConfig } from './utils/cloudinaryHelper.js';
import { verifyRazorpayCredentials } from './utils/razorpayDebug.js';
import cloudinary from 'cloudinary';

const app = express();
const PORT = process.env.PORT || 3000;

// Update CORS for production
const productionCorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://your-frontend-domain.vercel.app', // Replace with your actual frontend domain
      'http://localhost:5173', 
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(process.env.NODE_ENV === 'production' ? productionCorsOptions : corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling for production
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', bookRoutes);
app.use('/api', paymentRoutes);
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', studyMaterialRoutes);
app.use('/api/upload', uploadRoutes);

// Add a root route for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Management System API is running',
    status: 'ok',
    timestamp: new Date(),
    endpoints: [
      '/api/auth',
      '/api/orders',
      '/api/books',
      '/api/payments',
      '/api/users',
      '/api/events',
      '/api/schedules',
      '/api/study-materials',
      '/api/upload'
    ]
  });
});

// Health check route
app.get('/api/health', async (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      message: `Upload error: ${err.message}` 
    });
  } else if (err) {
    console.error('Server error:', err);
    return res.status(500).json({ 
      message: err.message || 'Something went wrong with the upload!' 
    });
  }
  next();
});

// Update the catch-all route to be more informative
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'API endpoint not found',
    method: req.method,
    url: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/books',
      'GET /api/orders/my',
      'POST /api/payments/razorpay/create-order'
    ]
  });
});

// For Vercel, we export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await verifyRazorpayCredentials();
    const cloudinaryStatus = await verifyCloudinaryConfig();
    if (!cloudinaryStatus.success) {
      console.error('⚠️ WARNING: Cloudinary is not properly configured!');
    } else {
      console.log('✅ Cloudinary configured successfully.');
    }
  });
}

export default app;