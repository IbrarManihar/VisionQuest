import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();


router.get('/schedules', scheduleController.getAllSchedules);

router.post('/schedules', upload.single('file'), scheduleController.addSchedule);

export default router;
