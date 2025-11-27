import React, { useState } from 'react'
import './ProjectArchitecture.css'

const ProjectArchitecture: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview')

  const architectureData = {
    overview: {
      title: '專案概覽',
      content: `
        <h3>專案定位</h3>
        <p><strong>Agile Project Platform</strong> 是一個現代化的敏捷專案管理平台，採用前後端分離架構，具備企業級安全防護和完整的開發流程。</p>
        
        <h3>核心價值</h3>
        <ul>
          <li><strong>安全性優先</strong>：六層次防禦架構，符合企業安全標準</li>
          <li><strong>可擴展性</strong>：微服務準備，支援水平擴展</li>
          <li><strong>開發效率</strong>：完整的開發工具鏈和自動化流程</li>
          <li><strong>用戶體驗</strong>：現代化 UI 和即時協作功能</li>
        </ul>
        
        <h3>技術棧總覽</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h4>前端技術</h4>
            <ul>
              <li>React 19.2.0 + TypeScript</li>
              <li>Vite 7.2.4 (建構工具)</li>
              <li>Tailwind CSS (樣式框架)</li>
              <li>React Router (路由管理)</li>
              <li>Axios (HTTP 客戶端)</li>
            </ul>
          </div>
          <div>
            <h4>後端技術</h4>
            <ul>
              <li>Node.js + Express 4.18.2</li>
              <li>TypeScript (類型安全)</li>
              <li>PostgreSQL (主資料庫)</li>
              <li>Redis (快取和會話)</li>
              <li>Joi (輸入驗證)</li>
              <li>JWT (身份認證)</li>
            </ul>
          </div>
        </div>
        
        <h3>部署架構</h3>
        <div style="text-align: center; margin: 20px 0;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; display: inline-block;">
            <strong>Internet</strong> → Nginx (8080) → Backend (3000) → PostgreSQL (5432) + Redis (6379)
          </div>
        </div>
        
        <h3>重點</h3>
        <ul>
          <li><strong>架構設計能力</strong>：分層架構、微服務準備</li>
          <li><strong>安全實作經驗</strong>：JWT、輸入驗證、防護機制</li>
          <li><strong>性能優化</strong>：連線池、快取策略、查詢優化</li>
          <li><strong>開發流程</strong>：Docker、TypeScript、自動化測試</li>
        </ul>
      `
    },
    architecture: {
      title: '系統架構設計',
      content: `
        <h3>整體架構圖</h3>
        <p>採用經典的三層架構 + 微服務準備設計：</p>
        
        <h4>表現層 (Presentation Layer)</h4>
        <ul>
          <li><strong>React SPA</strong>：單頁應用，組件化開發</li>
          <li><strong>狀態管理</strong>：Context API + Hooks</li>
          <li><strong>路由管理</strong>：React Router v6</li>
          <li><strong>UI 組件庫</strong>：Tailwind CSS + 自定義組件</li>
          <li><strong>HTTP 客戶端</strong>：Axios + 攔截器</li>
        </ul>
        
        <h4>API 層 (Application Layer)</h4>
        <ul>
          <li><strong>RESTful API</strong>：標準化接口設計</li>
          <li><strong>JWT 認證</strong>：雙 Token 機制</li>
          <li><strong>輸入驗證</strong>：Joi Schema 驗證</li>
          <li><strong>錯誤處理</strong>：統一錯誤格式</li>
          <li><strong>請求限制</strong>：Rate Limiting 防護</li>
        </ul>
        
        <h4>業務層 (Business Layer)</h4>
        <ul>
          <li><strong>服務層</strong>：業務邏輯封裝</li>
          <li><strong>資料模型</strong>：TypeScript 介面定義</li>
          <li><strong>權限控制</strong>：RBAC 角色管理</li>
          <li><strong>業務規則</strong>：驗證和約束</li>
          <li><strong>事務管理</strong>：資料一致性保證</li>
        </ul>
        
        <h4>資料層 (Data Layer)</h4>
        <ul>
          <li><strong>PostgreSQL</strong>：主資料庫，ACID 事務</li>
          <li><strong>Redis</strong>：快取層，會話存儲</li>
          <li><strong>連線池</strong>：高效資料庫連線管理</li>
          <li><strong>資料遷移</strong>：版本化資料庫結構</li>
          <li><strong>備份策略</strong>：自動化備份和恢復</li>
        </ul>
        
        <h3>設計原則</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h4>SOLID 原則</h4>
            <ul>
              <li><strong>單一職責</strong>：每個模組專注單一功能</li>
              <li><strong>開閉原則</strong>：擴展開放，修改封閉</li>
              <li><strong>里氏替換</strong>：子類可替換父類</li>
              <li><strong>介面隔離</strong>：最小化介面依賴</li>
              <li><strong>依賴倒置</strong>：依賴抽象而非具體</li>
            </ul>
          </div>
          <div>
            <h4>架構原則</h4>
            <ul>
              <li><strong>分層架構</strong>：清晰的職責分離</li>
              <li><strong>依賴注入</strong>：降低耦合度</li>
              <li><strong>配置外部化</strong>：環境變數管理</li>
              <li><strong>錯誤隔離</strong>：異常處理機制</li>
              <li><strong>可測試性</strong>：單元測試支援</li>
            </ul>
          </div>
        </div>
        
        <h3>講解要點</h3>
        <ol>
          <li><strong>為什麼選擇這個架構？</strong> - 可維護性、可擴展性、團隊協作</li>
          <li><strong>如何處理跨域問題？</strong> - CORS 中間件配置</li>
          <li><strong>如何保證資料一致性？</strong> - 事務管理和連線池</li>
          <li><strong>如何進行性能優化？</strong> - 快取策略和查詢優化</li>
        </ol>
      `
    },
    security: {
      title: '安全防護體系',
      content: `
        <h3>六層次安全防護架構</h3>
        <p>採用防禦深度 (Defense in Depth) 設計理念，實現企業級安全標準：</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>網路層安全 → 認證層 → 加密層 → 權限層 → 資料庫層 → 前端層</h4>
        </div>
        
        <h3>認證與授權系統</h3>
        <h4>JWT 雙 Token 機制</h4>
        <ul>
          <li><strong>Access Token</strong>：15分鐘有效期，用於 API 請求</li>
          <li><strong>Refresh Token</strong>：7天有效期，用於更新 Access Token</li>
          <li><strong>Token 撤銷</strong>：Redis 黑名單機制</li>
          <li><strong>自動刷新</strong>：前端自動處理 Token 過期</li>
        </ul>
        
        <code>// Token 生成示例<br>const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });<br>const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });</code>
        
        <h4>角色權限控制 (RBAC)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h5>角色層級</h5>
            <ul>
              <li><strong>Admin</strong>：系統管理員</li>
              <li><strong>Manager</strong>：專案管理員</li>
              <li><strong>Member</strong>：一般成員</li>
              <li><strong>Viewer</strong>：唯讀用戶</li>
            </ul>
          </div>
          <div>
            <h5>權限控制</h5>
            <ul>
              <li><strong>路由級權限</strong>：中間件檢查</li>
              <li><strong>資源級權限</strong>：資料所有權驗證</li>
              <li><strong>操作級權限</strong>：CRUD 操作控制</li>
              <li><strong>功能級權限</strong>：特定功能訪問</li>
            </ul>
          </div>
        </div>
        
        <h3>輸入驗證系統</h3>
        <h4>四層驗證架構</h4>
        <ol>
          <li><strong>Joi Schema 驗證</strong>：格式、類型、長度檢查</li>
          <li><strong>業務邏輯驗證</strong>：業務規則和約束</li>
          <li><strong>資料庫約束</strong>：外鍵完整性和唯一性</li>
          <li><strong>安全過濾</strong>：XSS 和 SQL 注入防護</li>
        </ol>
        
        <h4>認證驗證範例</h4>
        <code>// 註冊驗證 Schema<br>const registerSchema = Joi.object({<br>  email: Joi.string().email().required(),<br>  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/).required(),<br>  name: Joi.string().min(2).max(50).required(),<br>  confirmPassword: Joi.string().valid(Joi.ref('password')).required()<br>});</code>
        
        <h3>資料庫安全</h3>
        <h4>連線池管理</h4>
        <ul>
          <li><strong>連線限制</strong>：最大20個連線，防止耗盡</li>
          <li><strong>超時控制</strong>：2秒連線超時，30秒查詢超時</li>
          <li><strong>實時監控</strong>：連線狀態追蹤和健康檢查</li>
          <li><strong>攻擊檢測</strong>：異常連線模式自動警報</li>
        </ul>
        
        <h4>資料保護</h4>
        <ul>
          <li><strong>參數化查詢</strong>：防止 SQL 注入攻擊</li>
          <li><strong>敏感資料過濾</strong>：查詢時自動排除密碼等欄位</li>
          <li><strong>加密存儲</strong>：bcrypt 12輪鹽值加密</li>
          <li><strong>備份加密</strong>：資料庫備份檔加密儲存</li>
        </ul>
        
        <h3>前端安全</h3>
        <ul>
          <li><strong>XSS 防護</strong>：React 內建 + DOMPurify 清理</li>
          <li><strong>CSRF 保護</strong>：SameSite Cookie + CSRF Token</li>
          <li><strong>內容安全政策</strong>：CSP 標頭設置</li>
          <li><strong>安全傳輸</strong>：HTTPS 強制使用</li>
        </ul>
        
        <h3>安全重點</h3>
        <ol>
          <li><strong>如何防止常見攻擊？</strong> - XSS、CSRF、SQL 注入、DDoS</li>
          <li><strong>JWT 安全性如何保證？</strong> - 簽名驗證、過期機制、黑名單</li>
          <li><strong>如何處理權限控制？</strong> - RBAC 模型、中間件實作</li>
          <li><strong>資料庫安全措施？</strong> - 連線池、參數化查詢、加密存儲</li>
        </ol>
      `
    },
    implementation: {
      title: '核心功能實作',
      content: `
        <h3>已實作核心功能</h3>
        
        <h4>認證系統實作</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>功能特色</h5>
          <ul>
            <li><strong>雙 Token 機制</strong>：Access Token (15m) + Refresh Token (7d)</li>
            <li><strong>Token 撤銷</strong>：Redis 黑名單 + 自動過期</li>
            <li><strong>密碼安全</strong>：bcrypt 12輪鹽值加密</li>
            <li><strong>角色權限</strong>：Admin → Manager → Member → Viewer</li>
            <li><strong>密碼變更</strong>：當前密碼驗證 + 強度檢查</li>
          </ul>
        </div>
        
        <h5>技術實作細節</h5>
        <code>// JWT Token 生成<br>const accessToken = generateAccessToken({ userId, email, role });<br>const refreshToken = generateRefreshToken({ userId, email, role });<br><br>// Token 撤銷機制<br>await redis.sadd('token_blacklist', tokenId);<br>await redis.expire('token_blacklist', 7 * 24 * 60 * 60);</code>
        
        <h4>安全防護實作</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>防護機制</h5>
          <ul>
            <li><strong>六層次防護</strong>：網路 → 認證 → 加密 → 權限 → 資料庫 → 前端</li>
            <li><strong>輸入驗證</strong>：Joi Schema + 業務邏輯 + 資料庫約束</li>
            <li><strong>連線池管理</strong>：防連線耗盡 + 實時監控</li>
            <li><strong>Rate Limiting</strong>：15分鐘100次請求限制</li>
            <li><strong>安全標頭</strong>：Helmet 12種HTTP安全標頭</li>
          </ul>
        </div>
        
        <h5>驗證系統實作</h5>
        <code>// 輸入驗證中間件<br>export const validate = (schema: Joi.ObjectSchema) => {<br>  return (req, res, next) => {<br>    const { error, value } = schema.validate(req.body, {<br>      abortEarly: false,<br>      stripUnknown: true<br>    });<br>    if (error) return res.status(400).json({ error: '驗證失敗', details });<br>    req.body = value;<br>    next();<br>  };<br>};</code>
        
        <h4>資料庫管理實作</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>資料庫設計</h5>
          <ul>
            <li><strong>PostgreSQL</strong>：UUID 主鍵 + 外鍵完整性</li>
            <li><strong>Redis</strong>：會話存儲 + API 快取</li>
            <li><strong>連線池監控</strong>：健康檢查 + 統計端點</li>
            <li><strong>參數化查詢</strong>：防止 SQL 注入</li>
            <li><strong>資料隱私</strong>：自動排除敏感欄位</li>
          </ul>
        </div>
        
        <h5>連線池配置</h5>
        <code>// 連線池安全配置<br>const poolConfig = {<br>  max: 20,                    // 最大連線數<br>  min: 2,                     // 最小連線數<br>  idleTimeoutMillis: 30000,   // 空閒超時<br>  connectionTimeoutMillis: 2000, // 連線超時<br>  statement_timeout: 30000    // 查詢超時<br>};</code>
        
        <h3>規劃中功能</h3>
        
        <h4>即時通訊系統</h4>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h5>Socket.io 實作準備</h5>
          <ul>
            <li><strong>後端服務</strong>：完整的 Socket.io 服務架構</li>
            <li><strong>前端客戶端</strong>：TypeScript 客戶端實作</li>
            <li><strong>即時任務同步</strong>：狀態變更 + 進度更新</li>
            <li><strong>團隊協作</strong>：在線狀態 + 即時訊息</li>
            <li><strong>智能通知</strong>：個人 + 專案 + 系統通知</li>
          </ul>
        </div>
        
        <h4>專案管理功能</h4>
        <ul>
          <li><strong>專案 CRUD</strong>：完整的專案生命週期管理</li>
          <li><strong>任務管理</strong>：分配、追蹤、優先級管理</li>
          <li><strong>團隊協作</strong>：成員管理、權限控制</li>
          <li><strong>進度追蹤</strong>：甘特圖、燃盡圖、KPI</li>
        </ul>
        
        <h4>進階功能</h4>
        <ul>
          <li><strong>GraphQL API</strong>：查詢語言升級（評估中）</li>
          <li><strong>Prisma ORM</strong>：資料庫層優化（評估中）</li>
          <li><strong>微服務架構</strong>：服務拆分 + 負載均衡</li>
          <li><strong>CI/CD 流水線</strong>：自動化測試 + 部署</li>
        </ul>
        
        <h3>實作亮點總結</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h4>技術亮點</h4>
            <ul>
              <li><strong>類型安全</strong>：全端 TypeScript</li>
              <li><strong>安全優先</strong>：企業級防護</li>
              <li><strong>性能優化</strong>：連線池 + 快取</li>
              <li><strong>可擴展性</strong>：微服務準備</li>
            </ul>
          </div>
          <div>
            <h4>工程實踐</h4>
            <ul>
              <li><strong>代碼品質</strong>：ESLint + Prettier</li>
              <li><strong>版本控制</strong>：Git 工作流</li>
              <li><strong>容器化</strong>：Docker + Compose</li>
              <li><strong>文檔完整</strong>：詳細技術文檔</li>
            </ul>
          </div>
        </div>
      `
    },
    deployment: {
      title: '部署與運維',
      content: `
        <h3>容器化部署架構</h3>
        <p>採用 Docker 容器化部署，確保環境一致性和快速擴展：</p>
        
        <h4>Docker 容器設計</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h5>前端容器</h5>
            <ul>
              <li><strong>基礎映像</strong>：nginx:alpine</li>
              <li><strong>建構階段</strong>：Node.js + Vite</li>
              <li><strong>靜態檔案</strong>：Nginx 服務</li>
              <li><strong>端口</strong>：8080</li>
            </ul>
          </div>
          <div>
            <h5>後端容器</h5>
            <ul>
              <li><strong>基礎映像</strong>：node:20-alpine</li>
              <li><strong>建構階段</strong>：TypeScript 編譯</li>
              <li><strong>運行階段</strong>：生產依賴</li>
              <li><strong>端口</strong>：3000</li>
            </ul>
          </div>
        </div>
        
        <h4>資料庫容器</h4>
        <ul>
          <li><strong>PostgreSQL</strong>：postgres:15-alpine</li>
          <li><strong>Redis</strong>：redis:7-alpine</li>
          <li><strong>數據持久化</strong>：Volume 掛載</li>
          <li><strong>環境變數</strong>：.env 配置</li>
        </ul>
        
        <h3>Docker Compose 配置</h3>
        <code>version: '3.8'<br>services:<br>  frontend:<br>    build: ./frontend<br>    ports: ["8080:80"]<br>    depends_on: [backend]<br>  <br>  backend:<br>    build: ./backend<br>    ports: ["3000:3000"]<br>    depends_on: [postgres, redis]<br>    environment:<br>      - NODE_ENV=production<br><br>  postgres:<br>    image: postgres:15-alpine<br>    volumes: ["postgres_data:/var/lib/postgresql/data"]<br><br>  redis:<br>    image: redis:7-alpine<br>    volumes: ["redis_data:/data"]</code>
        
        <h3>運維管理</h3>
        <h4>監控端點</h4>
        <ul>
          <li><strong>/health</strong>：基本健康檢查</li>
          <li><strong>/health/db</strong>：資料庫連線檢查</li>
          <li><strong>/admin/pool-stats</strong>：連線池統計</li>
          <li><strong>/admin/metrics</strong>：系統指標（規劃中）</li>
        </ul>
        
        <h4>日誌管理</h4>
        <ul>
          <li><strong>應用日誌</strong>：Morgan 中間件</li>
          <li><strong>錯誤日誌</strong>：統一錯誤處理</li>
          <li><strong>安全日誌</strong>：認證和授權事件</li>
          <li><strong>性能日誌</strong>：查詢時間和連線狀態</li>
        </ul>
        
        <h3>部署流程</h3>
        <ol>
          <li><strong>環境準備</strong>：Docker + Docker Compose</li>
          <li><strong>代碼建構</strong>：npm run build</li>
          <li><strong>容器建構</strong>：docker-compose build</li>
          <li><strong>服務啟動</strong>：docker-compose up -d</li>
          <li><strong>健康檢查</strong>：curl /health</li>
        </ol>
        
        <h3>部署重點</h3>
        <ol>
          <li><strong>為什麼選擇 Docker？</strong> - 環境一致性、快速部署、資源隔離</li>
          <li><strong>如何處理配置管理？</strong> - 環境變數、Config Map</li>
          <li><strong>如何進行監控？</strong> - 健康檢查端點、日誌聚合</li>
          <li><strong>如何處理擴展？</strong> - 負載均衡、水平擴展</li>
        </ol>
        
        <h3>性能指標</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h5>當前性能</h5>
          <ul>
            <li><strong>啟動時間</strong>：前端 ~2秒，後端 ~3秒</li>
            <li><strong>記憶體使用</strong>：前端 ~50MB，後端 ~100MB</li>
            <li><strong>連線池</strong>：最大20連線，平均使用2-5連線</li>
            <li><strong>API 響應</strong>：平均 < 100ms</li>
          </ul>
        </div>
      `
    }
  }

  return (
    <div className="project-architecture">
      <div className="architecture-container">
        <div className="architecture-header">
          <h1>Agile Project Platform</h1>
          <p>專案架構介紹</p>
        </div>

        <div className="architecture-nav">
          {Object.entries(architectureData).map(([key, data]) => (
            <button
              key={key}
              className={`nav-button ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              {data.title}
            </button>
          ))}
        </div>

        <div className="architecture-content">
          <div 
            className="content-section"
            dangerouslySetInnerHTML={{ __html: architectureData[activeSection as keyof typeof architectureData].content }}
          />
        </div>

        <div className="architecture-footer">
          <h3>展示亮點</h3>
          <div className="highlights">
            <div className="highlight-item">
              <h4>現代化架構設計</h4>
              <p>分層架構 + 微服務準備 + 容器化部署，展現系統設計能力</p>
            </div>
            <div className="highlight-item">
              <h4>企業級安全防護</h4>
              <p>六層次防禦架構 + JWT 認證 + 輸入驗證，體現安全意識</p>
            </div>
            <div className="highlight-item">
              <h4>性能優化實踐</h4>
              <p>連線池管理 + Redis 快取 + 查詢優化，展示性能調優經驗</p>
            </div>
            <div className="highlight-item">
              <h4>完整工程實踐</h4>
              <p>TypeScript + Docker + 測試 + 文檔，展現專業開發流程</p>
            </div>
          </div>
          
                  </div>
      </div>
    </div>
  )
}

export default ProjectArchitecture
