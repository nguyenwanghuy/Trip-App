import express from "express";
import AuthCtrl from "../controllers/authController.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'
const router = express.Router();
//http://localhost:8001/trip/auth
router.post('/login', AuthCtrl.login); // đăng nhập tài khoản
router.post('/register', AuthCtrl.register); // đăng ký tài khoản
router.get('/me',authMiddleware ,AuthCtrl.getMe); // vào trang cá nhân
router.put('/me/profile',authMiddleware ,AuthCtrl.getMeProfile); // sửa trang cá nhân
export default router;