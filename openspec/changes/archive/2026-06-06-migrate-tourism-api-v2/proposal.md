## Why

現行網站串接的觀光資料 V1.0 API（`/v2/Tourism/ScenicSpot`、`Activity` 等路徑）將於 **115 年 06 月 30 日下架**。為維持景點、餐飲、旅宿、活動四類資料的查詢功能不中斷，需在下架前改接至觀光資料 V2.1 API，並同步調整路徑、欄位命名與巢狀結構。

## What Changes

- **API 路徑改接**：四類資料改用 V2.1 路徑（`/service/odata/V2/Tourism/...`）。**BREAKING** 類別名稱變更：景點 `ScenicSpot` → `Attraction`、活動 `Activity` → `Event`；旅宿 `Hotel`、餐飲 `Restaurant` 維持。
- **識別欄位更名**：**BREAKING** `ScenicSpotID/Name` → `AttractionID/Name`、`ActivityID/Name` → `EventID/Name`。
- **影像結構巢狀化**：**BREAKING** 由固定 `Picture.PictureUrl1~3` 改為彈性多筆 `Images/Image`（含必填 `Name`），adapter 需改讀陣列。
- **地址與電話巢狀化**：`Address`/`City` 整合為 `PostalAddress`；`Phone` 改為 `Telephones/Telephone` 巢狀結構。
- **座標欄位上移**：`PositionLon`/`PositionLat` 由 `Position` 下層移至第一層。
- **類別欄位調整**：`Class1/2/3`、`Class` 改用 V2.1 的 `Classes` 巢狀結構。
- **必填欄位新增/變更**：語系（`Language`）、更新時間（`UpdateTime`，ISO8601）、`ProviderID`（原 `Orgname`）、`UpdateInterval` 等。
- **正式 API 驗證**：改接後以 `.env.production` 環境變數呼叫正式 TDX API，驗證四類列表頁與詳情頁資料可正常取得與顯示，並透過瀏覽器 UI 操作確認串接正確。
- **Swagger 文件**：改接完成後，依本網站實際消費的 V2.1 四類端點(路徑、OData 查詢參數、回應 schema)產出 OpenAPI/Swagger 文件。

## Capabilities

### New Capabilities
- `tourism-api`: 涵蓋觀光四類資料（景點/餐飲/旅宿/活動）的 API 請求路徑、查詢參數（OData $select/$filter/$top）、回應欄位結構，以及前端 adapter 將原始回應轉換為統一 `Card`/詳情格式的契約。

### Modified Capabilities
<!-- 目前 openspec/specs/ 無既有 spec,故無修改既有 capability -->

## Impact

- **程式碼**：`src/api/index.ts`（路徑）、`src/api/adapter.ts`（欄位映射）、`src/types.ts`（型別）、`src/stores/main.ts`（OData `$select`/`$filter` 欄位名）。
- **環境變數**：`.env.production` 的 `VITE_API_URL`（正式 TDX 端點）；token 取得流程不變。
- **測試**：既有 `SearchForm` 測試不受影響；新增/調整 adapter 對應測試。
- **文件**：新增 OpenAPI/Swagger 文件(如 `docs/openapi.yaml`),描述網站消費的 V2.1 四類端點。
- **風險**：V1.0 於 2026-06-30 下架,須在此之前完成改接與驗證。
