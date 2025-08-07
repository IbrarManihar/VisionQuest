import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book-covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 700, crop: 'limit' }]
  }
});


const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = express.Router();

router.get('/books', bookController.getAllBooks);
router.post('/lend', protect, upload.single('photo'), bookController.addBook);
router.post('/borrow', bookController.buyBook);
router.get('/seller/orders', protect, bookController.getSellerOrders);
router.get('/admin/books', protect, admin, bookController.getAdminBooks);
router.put('/admin/books/:id', protect, admin, bookController.updateBookAvailability);

router.put('/admin/books/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});


router.put('/seller/orders/:orderId', protect, bookController.updateOrderStatus);
export default router;
