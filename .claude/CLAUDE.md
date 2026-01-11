# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 項目概述

台灣旅遊景點導覽網站，使用 Vue 3 + TypeScript + Vite 構建。通過交通部 TDX API 提供旅遊景點、餐飲、旅宿與活動資訊查詢功能，支援縣市篩選、搜尋和收藏功能。

## 開發命令

### 基本命令
- `npm run dev` - 啟動開發伺服器（本地開發）
- `npm run build` - 生成生產環境構建（包含型別檢查）
- `npm run build-only` - 僅執行 Vite 構建（跳過型別檢查）
- `npm run preview` - 預覽生產環境構建

### 測試命令
- `npm run test:unit` - 執行 Vitest 單元測試
- `npm run vitest:ui` - 啟動 Vitest UI 介面查看測試結果

### 型別檢查
- `npm run type-check` - 執行 TypeScript 型別檢查

## 核心架構

### 文件結構
- `src/` - 源代碼目錄
  - `views/` - 頁面組件（Home.vue - 列表頁, Detail.vue - 詳情頁）
  - `components/` - 可複用組件（Card、Pagination、SearchForm、ThumbsGallery 等）
  - `stores/` - Pinia 狀態管理（main.ts 為主狀態儲存）
  - `router/` - Vue Router 路由配置
  - `api/` - API 請求層（index.ts - API 方法, adapter.ts - 數據轉換）
  - `composables/` - Vue 組合式 API（favorite.ts - 收藏, loading.ts - 加載狀態, paginatedItems.ts - 分頁）
  - `types.ts` - TypeScript 型別定義

### 架構設計

**路由結構**：4 條主要路由
- `/ScenicSpot` - 景點列表/詳情 (路由參數 type, id, query)
- `/Restaurant` - 餐飲列表/詳情
- `/Hotel` - 旅宿列表/詳情
- `/Activity` - 活動列表/詳情

**數據流**：
1. 路由守衛（router/index.ts）在頁面加載前執行 `beforeResolve`
2. 調用對應的初始化函數（`initHomePageData` 或 `initDetailPageData`）
3. 通過 Pinia store (useMainStore) 取得 Token 和數據
4. Store 使用 API 層取得原始數據，再通過 adapter 轉換成統一格式
5. 組件透過 store 中的響應式狀態顯示數據

**狀態管理**（Pinia）：
- token - API 認證 token，每 6 小時自動重新整理
- scenicSpotList, restaurantList, hotelList, activityList - 各類型項目列表
- sortedCardList - computed 屬性，依 orderby 排序列表
- detailData - 詳情頁資料
- cityList - 縣市列表
- isLoading、isOpenModal、orderby - UI 狀態

**API 層（axios）**：
- baseURL 為 TDX API 端點（環境變數 VITE_API_URL）
- 請求/響應攔截器管理 isLoading 狀態
- 包含速率限制錯誤處理（429 status code）
- Token 通過代理 API 取得（VITE_TOKEN_API_URL）

### 技術棧
- Vue 3 - 前端框架
- TypeScript - 型別檢查
- Vite - 建置工具
- Pinia - 狀態管理
- UnoCSS - 原子化 CSS 框架
- Vue Router - 路由管理
- Axios - HTTP 請求
- Swiper - 圖片輪播
- Radix Vue & Headless UI - 無樣式 UI 組件
- Vitest - 單元測試
- GSAP - 動畫庫

### 環境變數
部署時需配置以下環境變數（.env 檔案或 CI/CD 秘密）：
- `VITE_API_URL` - TDX API 基礎 URL
- `VITE_TOKEN_API_URL` - Token 取得 API URL
- `VITE_CLIENT_ID` - TDX API 認證 ID（GitHub Actions 秘密）
- `VITE_CLIENT_SECRET` - TDX API 認證密鑰（GitHub Actions 秘密）

### 部署
- GitHub Pages 部署（.github/workflows/deploy.yml）
- 生產環境基礎路徑：`/thef2e-2021-w1-tourism/`（見 vite.config.ts）
- 觸發條件：推送至 master 分支或手動觸發 workflow

## 常見開發任務

### 添加新功能頁面
1. 在 router/index.ts 新增路由，遵循 `/:type/:id` 模式
2. 建立對應的 View 組件
3. 在 store 中添加數據獲取方法和狀態
4. 使用 adapter 模式轉換 API 返回的數據

### 修改 API 查詢邏輯
- API 方法集中在 src/api/index.ts
- 查詢參數組裝在 store 的 get* 方法中（如 getScenicSpotList）
- 使用 OData 查詢語法（$select、$filter、$top）
- 重要：所有 API 請求都需要 Authorization header 中的 token

### 調試 API 問題
- 檢查 router.ts 中的 429 速率限制錯誤處理
- token 每 6 小時自動更新，若過期會導致 401 錯誤
- 使用 Vitest UI (`npm run vitest:ui`) 進行測試和調試
- 在 api/index.ts 中設置的攔截器會自動管理加載狀態

### 樣式修改
- 使用 UnoCSS 原子化 CSS（見 vite.config.ts）
- 自動導入組件和組合式函數（unplugin-auto-import 和 unplugin-vue-components）
- 預設 Tailwind CSS 重置（main.ts 中引入）

## 注意事項
- 使用繁體中文回覆
- 生產環境構建自動進行型別檢查，型別錯誤會導致構建失敗
- 跨域請求使用環境變數配置的 API 端點，確保代理設置正確
