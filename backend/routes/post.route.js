import express from 'express';
import PostCtrl from '../controllers/PostController.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

import  uploadFile from '../configs/upload.multer.js'

const router = express.Router();
router.use(authMiddleware)

router.get('/', PostCtrl.getAllPosts );
router.post('/', PostCtrl.createPost);
router.get('/:id/users', PostCtrl.getPost ); // get post user 
router.put('/:id', PostCtrl.updatePost);
router.delete('/:id', PostCtrl.deletePost);

router.get('/:idPost/like/:id', PostCtrl.checklike); //kiểm tra trạng thái like của một bài viết cho một người dùng cụ thể.
router.put('/:idPost/like', PostCtrl.likePost);

router.post('/image',uploadFile.array('image',5),PostCtrl.uploadsImage)






export default router;