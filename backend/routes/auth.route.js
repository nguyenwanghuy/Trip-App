import express from "express";
import AuthCtrl from "../controllers/authController.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'
const router = express.Router();

router.post('/login', AuthCtrl.login);
router.post('/register', AuthCtrl.register);
router.get('/me',authMiddleware ,AuthCtrl.getMe);
export default router;