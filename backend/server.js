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


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


import routes from './routes/index.js';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api', routes);


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

app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await verifyRazorpayCredentials();

  const cloudinaryStatus = await verifyCloudinaryConfig();
  if (!cloudinaryStatus.success) {
    console.error('⚠️ WARNING: Cloudinary is not properly configured!');
    console.error('⚠️ Image uploads will not work correctly.');
    console.error(`⚠️ ${cloudinaryStatus.message}`);
  } else {
    console.log('✅ Cloudinary configured successfully.');
  }
});

export default app;
   