import express from 'express';
import UserCtrl from '../controllers/UserController.js';
import  uploadFile from '../configs/upload.multer.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';

//http://localhost:8001/trip/user
const router = express.Router();

router.get('/:id',authMiddleware, UserCtrl.getUser)
router.get('/:id/friends',authMiddleware, UserCtrl.getUserFriends)
router.put('/:id/:friendId',authMiddleware,UserCtrl.addRemoveFriend)

router.post('/upload-avatar',authMiddleware,uploadFile.single('avatar') ,UserCtrl.uploadAvatar)






export default router;