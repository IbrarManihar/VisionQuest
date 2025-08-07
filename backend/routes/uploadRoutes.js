import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/file', protect, upload.single('file'), uploadController.uploadFile);

router.post('/files', protect, upload.array('files', 10), uploadController.uploadMultipleFiles);

export default router;
