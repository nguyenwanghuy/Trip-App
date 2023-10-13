import express from 'express';
import UserCtrl from '../controllers/UserController.js';
import  uploadFile from '../configs/uploadAvatar.multer.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:id',authMiddleware, UserCtrl.getUser)
router.get('/:id/friends',authMiddleware, UserCtrl.getUserFriends)

router.post('/upload-avatar',authMiddleware,uploadFile.single('avatar') ,UserCtrl.uploadAvatar)






export default router;