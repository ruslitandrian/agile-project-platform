import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

// 擴展 Socket 介面以包含自定義屬性
interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(app: express.Application) {
    const server = createServer(app);
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupEventHandlers();
    server.listen(3001); // Socket.io 使用不同端口
    console.log('Socket.io server running on port 3001');
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.id}`);

      // 用戶身份驗證
      socket.on('authenticate', (token: string) => {
        try {
          // 驗證 JWT token
          const decoded = this.verifyToken(token);
          socket.userId = decoded.userId;
          this.connectedUsers.set(decoded.userId, socket.id);
          
          // 加入用戶專屬房間
          socket.join(`user_${decoded.userId}`);
          
          // 發送連接成功通知
          socket.emit('authenticated', { success: true, userId: decoded.userId });
          
          // 通知其他用戶上線
          this.broadcastUserStatus(decoded.userId, 'online');
          
        } catch (error) {
          socket.emit('authentication_error', { message: 'Invalid token' });
          socket.disconnect();
        }
      });

      // 專案相關事件
      socket.on('join_project', (projectId: string) => {
        if (socket.userId) {
          socket.join(`project_${projectId}`);
          socket.emit('joined_project', { projectId });
        }
      });

      socket.on('leave_project', (projectId: string) => {
        if (socket.userId) {
          socket.leave(`project_${projectId}`);
          socket.emit('left_project', { projectId });
        }
      });

      // 即時任務更新
      socket.on('task_update', (data: { projectId: string; taskId: string; updates: any }) => {
        if (socket.userId) {
          // 廣播給專案內其他成員
          socket.to(`project_${data.projectId}`).emit('task_updated', {
            taskId: data.taskId,
            updates: data.updates,
            updatedBy: socket.userId,
            timestamp: new Date().toISOString()
          });
        }
      });

      // 即時訊息
      socket.on('send_message', (data: { projectId: string; content: string; type: 'text' | 'file' }) => {
        if (socket.userId) {
          const message = {
            id: this.generateId(),
            userId: socket.userId,
            content: data.content,
            type: data.type,
            timestamp: new Date().toISOString()
          };

          // 廣播給專案所有成員
          this.io.to(`project_${data.projectId}`).emit('new_message', message);
        }
      });

      // 即時通知
      socket.on('notification_read', (notificationId: string) => {
        if (socket.userId) {
          // 標記通知為已讀
          this.io.to(`user_${socket.userId}`).emit('notification_marked_read', {
            notificationId,
            userId: socket.userId
          });
        }
      });

      // 處理斷線
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.broadcastUserStatus(socket.userId, 'offline');
          console.log(`User disconnected: ${socket.userId}`);
        }
      });

      // 錯誤處理
      socket.on('error', (error: any) => {
        console.error('Socket error:', error);
      });
    });
  }

  // 廣播用戶狀態
  private broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    this.io.emit('user_status_changed', {
      userId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  // 發送個人通知
  public sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  // 發送專案通知
  public sendNotificationToProject(projectId: string, notification: any) {
    this.io.to(`project_${projectId}`).emit('project_notification', notification);
  }

  // 獲取在線用戶數量
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  // 檢查用戶是否在線
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // 簡單的 token 驗證 (實際應用中應使用更安全的方式)
  private verifyToken(token: string): any {
    // 這裡應該使用與認證系統相同的 JWT 驗證邏輯
    // 為了範例，這裡使用簡單的解碼
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  }

  // 生成唯一 ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
