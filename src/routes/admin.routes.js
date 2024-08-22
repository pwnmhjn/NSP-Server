import { Router } from 'express';
import {
  addAuthor,
  addChapter,
  addBook,
} from '../controllers/admin.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.route('/add-author').post(upload.single('avatar'), addAuthor);
router.route('/add-chapter').post(addChapter);
router.route('/add-book').post(upload.single('bookImage'), addBook);

export default router;
