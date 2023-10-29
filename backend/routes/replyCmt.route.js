import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import ReplyCmtCtrl from '../controllers/ReplyCmtController.js';

const router = express.Router();
router.use(authMiddleware)
//http://localhost:8001/trip/replyCmt
router.get('/', ReplyCmtCtrl.getReplyCmt) // lấy tất cả replycomment có thể không dùng đến
router.post('/:idCmt',ReplyCmtCtrl.createReplyCmt) // đăng theo id bài cmt
router.put('/:idCmt',ReplyCmtCtrl.updateReplyCmt) // update comment theo id cmt
router.delete('/:idCmt', ReplyCmtCtrl.deleteReplyCmt) // delete comment theo id cmt


export default router;