import express from 'express';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

router.get('/events', eventController.getAllEvents);
router.post('/events', eventController.addEvent);

export default router;
