import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import { connectionProtectionMiddleware, checkPoolHealth, getPoolStats } from './config/database';

const app = express();

// 連線池防護中間件 - 應用於所有路由
app.use(connectionProtectionMiddleware);

app.use(helmet()); // 提高安全性: Express.js 中間件，透過設定 HTTP 標頭來增強應用程式安全性
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
/* rateLimit 的主要目的
DDoS 攻擊：大量惡意請求癱瘓服務
API 濮用：單一用戶過度頻繁調用
爬蟲攻擊：自動化程式大量抓取資料
暴力破解：頻繁嘗試登入或操作
*/
app.use(morgan('combined')); // 記錄 HTTP 請求
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 連線池健康檢查端點
app.get('/health/db', async (req, res) => {
  try {
    const health = await checkPoolHealth();
    const stats = getPoolStats();
    
    res.status(health.healthy ? 200 : 503).json({
      status: health.healthy ? 'healthy' : 'unhealthy',
      database: health,
      pool: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// 連線池統計端點
app.get('/admin/pool-stats', (req, res) => {
  try {
    const stats = getPoolStats();
    res.json({
      pool: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get pool stats',
      message: (error as Error).message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database pool monitoring active`);
  console.log(`Connection exhaustion protection enabled`);
});

// TODO: Socket.io 功能暫時禁用，未來可重新啟用
// const socketService = new SocketService(app);
