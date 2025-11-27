import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';
import { validate } from '../utils/validation';
import { authSchemas } from '../utils/validation';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      // 使用 Joi 驗證輸入
      const { email, password, name } = req.body;
      
      // 檢查郵箱是否已存在
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Email already registered',
          details: [{ field: 'email', message: '此電子郵件已經被註冊' }]
        });
      }
      
      // 創建用戶
      const user = await UserModel.create(email, password, name);
      
      // 生成 tokens
      const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });
      const refreshToken = generateRefreshToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });
      
      // 移除敏感資訊
      const { password_hash, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: 'User registered successfully', 
        user: userWithoutPassword, 
        accessToken, 
        refreshToken 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      // 使用 Joi 驗證輸入
      const { email, password } = req.body;
      
      // 查找用戶
      const user = await UserModel.findByEmail(email);
      if (!user || !user.password_hash) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: [{ field: 'general', message: '電子郵件或密碼錯誤' }]
        });
      }
      
      // 驗證密碼
      const isValidPassword = await UserModel.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          details: [{ field: 'general', message: '電子郵件或密碼錯誤' }]
        });
      }
      
      // 生成 tokens
      const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });
      const refreshToken = generateRefreshToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });
      
      // 移除敏感資訊
      const { password_hash, ...userWithoutPassword } = user;
      
      res.json({ 
        message: 'Login successful', 
        user: userWithoutPassword, 
        accessToken, 
        refreshToken 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const user = await UserModel.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      // 移除敏感資訊
      const { password_hash, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const { currentPassword, newPassword } = req.body;
      
      // 獲取用戶資訊
      const user = await UserModel.findById(req.user.userId);
      if (!user || !user.password_hash) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // 驗證當前密碼
      const isValidCurrentPassword = await UserModel.verifyPassword(currentPassword, user.password_hash);
      if (!isValidCurrentPassword) {
        return res.status(400).json({ 
          error: 'Invalid current password',
          details: [{ field: 'currentPassword', message: '當前密碼錯誤' }]
        });
      }
      
      // 檢查新密碼是否與當前密碼相同
      const isSamePassword = await UserModel.verifyPassword(newPassword, user.password_hash);
      if (isSamePassword) {
        return res.status(400).json({ 
          error: 'New password cannot be the same as current password',
          details: [{ field: 'newPassword', message: '新密碼不能與當前密碼相同' }]
        });
      }
      
      // 更新密碼
      await UserModel.updatePassword(req.user.userId, newPassword);
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// 驗證中間件導出
export const validateRegister = validate(authSchemas.register);
export const validateLogin = validate(authSchemas.login);
export const validateChangePassword = validate(authSchemas.changePassword);
