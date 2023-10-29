import express from 'express';
import CommentCtrl from '../controllers/CommentController.js';
import { authMiddleware, verifyTokenUser } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(authMiddleware)
//http://localhost:8001/trip/comment
router.get('/', CommentCtrl.getComment) // lấy tất cả comment có thể không dùng đến
router.post('/:id',CommentCtrl.createComment) // đăng theo id bài post
router.put('/:id',verifyTokenUser,CommentCtrl.updateComment) // update comment theo id post
router.delete('/:id',verifyTokenUser,CommentCtrl.deleteComment) // delete comment theo id post






export default router;