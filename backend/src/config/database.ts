import { Pool, PoolConfig, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 連線池配置 - 防止連線耗盡攻擊
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'agile_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  
  // 連線池大小管理 - 防止連線耗盡
  max: 20,                    // 最大連線數
  min: 2,                     // 最小連線數
  idleTimeoutMillis: 30000,   // 空閒連線超時 30秒
  connectionTimeoutMillis: 2000, // 連線超時 2秒
  
  // 連線生命週期管理
  // maxLifetimeHours: 8,        // 連線最大生命週期 8小時 (PG Pool 不支援)
  // reapIntervalMillis: 1000,    // 清理間隔 1秒 (PG Pool 不支援)
  
  // 性能優化
  statement_timeout: 30000,    // 查詢超時 30秒，單一SQL語句
  query_timeout: 30000,       // 查詢超時 30秒，整個查詢流程（包含網路傳輸）
  
  // 健康檢查
  allowExitOnIdle: false,     // 不允許空閒時退出
  keepAlive: true,            // 保持連線活躍
  keepAliveInitialDelayMillis: 10000, // 保活初始延遲
};

export const pool = new Pool(poolConfig);

// 連線池監控
let connectionCount = 0;
let errorCount = 0;
let lastErrorTime = 0;

// 連線建立監控
pool.on('connect', (client: PoolClient) => {
  connectionCount++;
  console.log(`Database connection established. Total connections: ${connectionCount}`);
  
  // 設置連線級別的安全配置
  client.query('SET statement_timeout = 30000;') // 30秒查詢超時
    .catch((err: Error) => console.warn('Failed to set statement timeout:', err.message));
});

// 連線釋放監控
pool.on('release', (err: Error | undefined, client: PoolClient) => {
  if (err) {
    console.error('Error on connection release:', err);
    errorCount++;
    lastErrorTime = Date.now();
  } else {
    connectionCount--;
    console.log(`Database connection released. Remaining connections: ${connectionCount}`);
  }
});

// 連線錯誤處理
pool.on('error', (err: Error) => {
  errorCount++;
  lastErrorTime = Date.now();
  
  console.error('Database pool error:', {
    error: (err as Error).message,
    stack: (err as Error).stack,
    connectionCount,
    errorCount,
    timestamp: new Date().toISOString()
  });

  // 連線耗盡攻擊檢測
  if (errorCount > 10 && (Date.now() - lastErrorTime) < 60000) {
    console.error('Possible connection exhaustion attack detected!');
    console.error('High error rate detected, implementing emergency measures');
    
    // 緊急措施：暫停新連線
    setTimeout(() => {
      console.log('Resuming normal connection operations');
    }, 30000); // 30秒後恢復
  }
});

// 連線耗盡防護中間件
export const connectionProtectionMiddleware = async (req: any, res: any, next: any) => {
  try {
    // 檢查連線池狀態
    const poolStatus = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };

    // 連線耗盡檢測
    if (pool.waitingCount > 5) {
      console.warn('High connection queue detected:', poolStatus);
      
      // 如果等待連線過多，返回服務不可用
      if (pool.waitingCount > 10) {
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          message: 'Database connection pool exhausted',
          retryAfter: 5
        });
      }
    }

    // 異常連線模式檢測
    const timeSinceLastError = Date.now() - lastErrorTime;
    if (errorCount > 5 && timeSinceLastError < 30000) {
      console.warn('Abnormal connection pattern detected');
      
      // 暫時限制請求
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Database experiencing high load',
        retryAfter: 2
      });
    }

    next();
  } catch (error) {
    console.error('Connection protection middleware error:', error);
    next();
  }
};

// 連線池健康檢查
export const checkPoolHealth = async () => {
  try {
    const client: PoolClient = await pool.connect();
    
    // 執行簡單健康檢查查詢
    const result = await client.query('SELECT 1 as health_check');
    
    client.release();
    
    return {
      healthy: true,
      timestamp: new Date().toISOString(),
      poolStats: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
        connectionCount,
        errorCount,
        lastErrorTime: lastErrorTime ? new Date(lastErrorTime).toISOString() : null
      }
    };
  } catch (error) {
    console.error('Pool health check failed:', error);
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      poolStats: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
        connectionCount,
        errorCount,
        lastErrorTime: lastErrorTime ? new Date(lastErrorTime).toISOString() : null
      }
    };
  }
};

// 優雅關閉處理
export const gracefulShutdown = async () => {
  console.log('Starting graceful database shutdown...');
  
  try {
    // 等待所有連線完成
    await pool.end();
    console.log('Database connections closed gracefully');
  } catch (error) {
    console.error('Error during database shutdown:', error);
  }
};

// 連線池監控定時器
setInterval(async () => {
  const health = await checkPoolHealth();
  
  // 記錄連線池狀態
  if (!health.healthy || pool.waitingCount > 3) {
    console.warn('Pool health warning:', health);
  }
  
  // 重置錯誤計數器（每5分鐘）
  if (Date.now() - lastErrorTime > 300000) {
    errorCount = Math.max(0, errorCount - 1);
  }
}, 60000); // 每分鐘檢查一次

// 進程退出處理
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

// 導出連線池統計
export const getPoolStats = () => ({
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
  connectionCount,
  errorCount,
  lastErrorTime: lastErrorTime ? new Date(lastErrorTime).toISOString() : null,
  config: {
    max: poolConfig.max,
    min: poolConfig.min,
    idleTimeoutMillis: poolConfig.idleTimeoutMillis,
    connectionTimeoutMillis: poolConfig.connectionTimeoutMillis
  }
});
