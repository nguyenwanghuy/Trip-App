import express from 'express';
import CommentCtrl from '../controllers/CommentController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router = express.Router();
router.use(authMiddleware)

router.get('/', CommentCtrl.getComment)
router.post('/:id',CommentCtrl.createComment)
router.put('/:id',CommentCtrl.updateComment)
router.delete('/:id',CommentCtrl.deleteComment)






export default router;