import express from 'express';
import * as studyMaterialController from '../controllers/studyMaterialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/study-materials', studyMaterialController.getAllStudyMaterials);

router.post(
  '/study-materials',
  protect,
  upload.array('files', 2),
  studyMaterialController.addStudyMaterial
);

router.delete(
  '/study-materials/:id',
  protect,
  studyMaterialController.deleteStudyMaterial
);


export default router;
