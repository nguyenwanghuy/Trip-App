import express from "express";
import AuthCtrl from "../controllers/AuthController.js";
import {authMiddleware, verifyTokenUser} from '../middlewares/auth.middleware.js'

const router = express.Router();
//http://localhost:8001/trip/auth
router.post('/login', AuthCtrl.login); // đăng nhập tài khoản
router.post('/register', AuthCtrl.register); // đăng ký tài khoản
router.get('/me',authMiddleware ,AuthCtrl.getMe); // vào trang cá nhân
router.put('/me/profile/:id',authMiddleware,verifyTokenUser ,AuthCtrl.getMeProfile); // sửa trang cá nhân
router.post('/refresh',AuthCtrl.requestRefreshToken) // refresh token
router.post('/logout', authMiddleware,AuthCtrl.logout) // logout
export default router;