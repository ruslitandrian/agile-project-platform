# Agile Project Platform

一個基於現代技術棧的敏捷專案管理平台，提供完整的用戶認證、專案管理和任務追蹤功能。

## 🚀 技術棧

### 前端
- **React 19.2.0** - 現代化用戶介面框架
- **TypeScript** - 類型安全的 JavaScript
- **Vite** - 快速的建置工具
- **CSS3** - 原生樣式與響應式設計

### 後端
- **Node.js** - 伺服器端運行環境
- **Express.js** - Web 應用框架
- **TypeScript** - 類型安全的開發體驗
- **Socket.io** - 即時通訊支援（預留功能）

### 資料庫與快取
- **PostgreSQL 15** - 主要關聯式資料庫
- **Redis 7** - 快取與會話儲存

### 部署與容器化
- **Docker** - 容器化部署
- **Docker Compose** - 多服務編排
- **Nginx** - 前端靜態檔案服務

## 📋 功能特性

### 已實現功能
- ✅ **用戶認證系統**
  - 用戶註冊與登入
  - JWT Token 認證
  - 密碼變更功能
  - 用戶個人資料管理

- ✅ **安全性防護**
  - 速率限制 (Rate Limiting)
  - CORS 跨域保護
  - Helmet 安全標頭
  - 資料庫連線池保護

- ✅ **系統監控**
  - 健康檢查端點
  - 資料庫連線狀態監控
  - 連線池統計資訊

- ✅ **現代化 UI**
  - 響應式設計
  - 用戶儀表板
  - 專案架構視圖
  - 即時狀態更新

### 資料庫架構
- **users** - 用戶資料表
- **projects** - 專案資料表
- **tasks** - 任務資料表
- 完整的關聯性與索引設計

## 🛠️ 快速開始

### 環境需求
- Node.js 18+
- Docker & Docker Compose
- 至少 4GB 可用記憶體

### 一鍵部署
```bash
# 克隆專案
git clone <repository-url>
cd agile-project-platform

# 啟動所有服務
docker-compose up -d

# 檢查服務狀態
docker-compose ps
```

### 訪問應用程式
- **前端介面**: http://localhost:8080
- **後端 API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📁 專案結構

```
agile-project-platform/
├── backend/                 # 後端 API 服務
│   ├── src/
│   │   ├── app.ts          # 應用程式入口
│   │   ├── config/         # 設定檔
│   │   ├── controllers/    # 控制器
│   │   ├── middlewares/    # 中介軟體
│   │   ├── models/         # 資料模型
│   │   ├── routes/         # 路由定義
│   │   ├── services/       # 業務邏輯
│   │   └── utils/          # 工具函式
│   ├── Dockerfile          # Docker 建置檔案
│   ├── init.sql           # 資料庫初始化
│   └── package.json       # 依賴管理
├── frontend/               # 前端 React 應用
│   ├── src/
│   │   ├── components/    # React 元件
│   │   ├── contexts/      # React Context
│   │   ├── services/      # API 服務
│   │   └── styles/        # 樣式檔案
│   ├── Dockerfile         # Docker 建置檔案
│   ├── nginx.conf         # Nginx 設定
│   └── package.json       # 依賴管理
├── docker-compose.yml      # Docker Compose 設定
├── DOCKER_README.md       # Docker 部署指南
└── test-auth.js          # 認證測試腳本
```

## 🔧 開發模式

### 本地開發環境
```bash
# 啟動開發模式
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 或分別啟動各服務
cd backend && npm run dev
cd frontend && npm run dev
```

### 環境變數設定
建立 `.env` 檔案：
```bash
# 資料庫設定
POSTGRES_DB=agile_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# JWT 設定
JWT_SECRET=your-super-secure-jwt-secret-key

# 應用程式設定
NODE_ENV=production
PORT=3000
```

## 📚 API 文件

### 認證端點
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `GET /api/auth/profile` - 獲取個人資料
- `PUT /api/auth/change-password` - 變更密碼

### 系統端點
- `GET /health` - 系統健康檢查
- `GET /health/db` - 資料庫健康檢查
- `GET /admin/pool-stats` - 連線池統計

## 🧪 測試

### 認證功能測試
```bash
# 測試登入 API
node test-auth.js
```

### 健康檢查
```bash
# 檢查後端健康狀態
curl http://localhost:3000/health

# 檢查資料庫連線
curl http://localhost:3000/health/db
```

## 🔒 安全性

### 已實現的安全措施
- **速率限制**: 每 15 分鐘最多 100 個請求
- **輸入驗證**: 使用 Joi 進行嚴格的輸入驗證
- **密碼加密**: 使用 bcrypt 進行密碼雜湊
- **JWT 認證**: 安全的 Token 認證機制
- **連線池保護**: 防止資料庫連線耗盡攻擊

### 安全標頭
- Helmet 中介軟體提供的安全 HTTP 標頭
- CORS 跨域保護設定
- 內容安全政策 (CSP)

## 📊 監控與日誌

### 系統監控
```bash
# 查看服務狀態
docker-compose ps

# 查看資源使用情況
docker stats

# 查看即時日誌
docker-compose logs -f
```

### 資料庫管理
```bash
# 備份資料庫
docker-compose exec postgres pg_dump -U postgres agile_platform > backup.sql

# 還原資料庫
docker-compose exec -T postgres psql -U postgres agile_platform < backup.sql
```

## 🚀 部署

### 生產環境部署
```bash
# 建置並啟動生產環境
docker-compose up --build -d

# 查看服務狀態
docker-compose ps
```

### 效能優化
- 多階段 Docker 建置優化映像大小
- 資料庫連線池配置
- Redis 快取策略
- Nginx 靜態檔案服務

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request


## 🆘 故障排除

### 常見問題

1. **端口衝突**
   ```bash
   # 檢查端口使用情況
   netstat -tulpn | grep :80
   # 或修改 docker-compose.yml 中的端口映射
   ```

2. **資料庫連線失敗**
   ```bash
   # 檢查網路連線
   docker-compose exec backend ping postgres
   # 查看資料庫日誌
   docker-compose logs postgres
   ```

3. **記憶體不足**
   ```bash
   # 增加 Docker 記憶體限制
   # 或使用輕量化映像
   ```

### 重置環境
```bash
# 完全重置（會刪除所有資料）
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

## 📞 支援

如有問題或建議，請透過以下方式聯繫：
- 建立 Issue
- 發送郵件
- 參與討論

---

**Agile Project Platform** - 讓專案管理更簡單、更高效！
