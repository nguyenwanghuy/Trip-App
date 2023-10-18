import express from 'express';
import PostCtrl from '../controllers/PostController.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

import uploadFileImage from '../configs/uploadImage.multer.js';

const router = express.Router();
// router.use(authMiddleware)

router.get('/', PostCtrl.getAllPosts);
router.post('/', PostCtrl.createPost);
router.get('/:id', PostCtrl.getPost);
router.put('/:id', PostCtrl.updatePost);
router.delete('/:id', PostCtrl.deletePost);

router.post(
  '/image/:id',
  uploadFileImage.single('image'),
  PostCtrl.uploadsImage,
);

export default router;
