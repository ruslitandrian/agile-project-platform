import { Router } from 'express';
import { AuthController, validateRegister, validateLogin, validateChangePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// 註冊路由 - 應用輸入驗證
router.post('/register', validateRegister, AuthController.register);

// 登入路由 - 應用輸入驗證
router.post('/login', validateLogin, AuthController.login);

// 獲取個人資料 - 需要身份認證
router.get('/profile', authenticate, AuthController.getProfile);

// 變更密碼 - 需要身份認證 + 輸入驗證
router.put('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

export default router;
