## 1. 探測正式 API 回應

- [x] 1.1 以 `.env.production` 的 `VITE_TOKEN_API_URL` 取得正式 token
- [x] 1.2 用 token 對 V2.1 四類資源(Attraction/Restaurant/Hotel/Event)各抓一筆真實 JSON
- [x] 1.3 比對真實回應與 `migrate-api.md`,確認實際欄位名、巢狀層級與完整路徑前綴
- [x] 1.4 確認 V2.1 是否支援 `$select` 子欄位選取與 `$filter` 語法

## 2. 型別定義(src/types.ts)

- [x] 2.1 新增 `Image`、`PostalAddress`、`Telephone`、`ClassInfo` 等巢狀型別
- [x] 2.2 以 V2.1 欄位重寫 `ScenicSpot/Restaurant/Hotel/Activity` 的 `*ListApiResponse` 與 `*ApiResponse`(含 ID/Name 更名、座標上移)
- [x] 2.3 移除不再使用的 `PictureUrl`/`PictureDescription` 與相關 keys 型別

## 3. API 路徑(src/api/index.ts)

- [x] 3.1 景點函式改打 V2.1 `Attraction` 路徑
- [x] 3.2 活動函式改打 V2.1 `Event` 路徑
- [x] 3.3 旅宿/餐飲路徑對齊 V2.1,確認完整前綴與 `VITE_API_URL` baseURL 一致

## 4. 資料轉換(src/api/adapter.ts)

- [x] 4.1 影像改讀 `Images/Image` 陣列:列表取首張、詳情取多張,保留佔位圖回退
- [x] 4.2 ID/Name 改讀 `AttractionID/Name`、`EventID/Name` 等 V2.1 欄位
- [x] 4.3 縣市由 `City` 或 `PostalAddress` 推導;電話取 `Telephones/Telephone` 首筆
- [x] 4.4 類別由 `Classes` 巢狀結構彙整為 `classes` 字串陣列

## 5. 查詢邏輯(src/stores/main.ts)

- [x] 5.1 各 `getXxxList` 的 `$select` 欄位改為 V2.1 欄位名
- [x] 5.2 景點搜尋 `$filter` 改用 `contains(AttractionName,...)`、活動改 `EventName`
- [x] 5.3 詳情查詢 `eq` 條件改用 `AttractionID`/`EventID` 等 V2.1 ID 欄位
- [x] 5.4 若 `$select` 不支援巢狀子欄位,改抓整筆或僅選第一層

## 6. 驗證

- [x] 6.1 `npm run type-check` 通過
- [x] 6.2 以 `.env.production` baseURL 啟動 `npm run dev`,逐一驗證四類列表頁資料正常顯示
- [x] 6.3 驗證四類詳情頁(影像圖庫、電話、類別、開放時間)正常顯示
- [x] 6.4 確認既有測試 `npm run test:unit` 通過,必要時調整 adapter 對應測試
- [x] 6.5 `npm run build` 成功(含型別檢查)

## 7. UI 操作驗證(瀏覽器)

- [x] 7.1 啟動開發伺服器並於瀏覽器開啟四類列表頁
- [x] 7.2 操作縣市篩選與關鍵字搜尋,確認列表正確更新
- [x] 7.3 點擊卡片進入各類詳情頁,確認影像圖庫、類別、電話、開放時間顯示正確
- [x] 7.4 驗證收藏、分頁、排序等既有互動未因改接而異常
- [x] 7.5 檢查瀏覽器 console 無 API 錯誤(401/429/欄位 undefined)

## 8. Swagger 文件

- [x] 8.1 建立 `docs/openapi.yaml`(OpenAPI 3.x),baseURL 對應 `VITE_API_URL`
- [x] 8.2 定義四類端點(Attraction/Restaurant/Hotel/Event)路徑與 OData query 參數($select/$filter/$top)
- [x] 8.3 依定稿後的 V2.1 回應撰寫 components/schemas(影像/地址/電話/類別等巢狀結構)
- [x] 8.4 以 Swagger Editor 或 lint 驗證文件無語法錯誤
