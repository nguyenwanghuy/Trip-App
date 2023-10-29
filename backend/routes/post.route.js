import express from 'express';
import PostCtrl from '../controllers/PostController.js';
import { authMiddleware, verifyTokenPost } from '../middlewares/auth.middleware.js';
import  uploadFile from '../configs/upload.multer.js'

const router = express.Router();
router.use(authMiddleware)
//http://localhost:8001/trip/post
router.get('/', PostCtrl.getAllPosts ); // lất tất cả bài post
router.post('/', PostCtrl.createPost); // tạo 1 bài post
router.get('/:id/users', PostCtrl.getPost ); // get post user 
router.put('/:id', verifyTokenPost,PostCtrl.updatePost); // update post
router.delete('/:id',verifyTokenPost,PostCtrl.deletePost); // delete post
router.put('/:idPost/like', PostCtrl.likePost); // like post
router.post('/image',uploadFile.array('image',5),PostCtrl.uploadsImage) // upload image tối đa 5 ảnh
router.post('/viewFriend', PostCtrl.checkViewFriend) // chọn bạn để được xem
router.post('/viewPrivate', PostCtrl.checkViewPrivate) // chọn xem 1 mình




export default router;