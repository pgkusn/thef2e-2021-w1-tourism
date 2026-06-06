## Context

網站目前透過 `src/api/index.ts` 串接觀光資料 V1.0(路徑 `/api/basic/v2/Tourism/{ScenicSpot|Restaurant|Hotel|Activity}`),回應為 JSON,經 `src/api/adapter.ts` 轉成統一的 `Card`(列表)與詳情物件,再由 Pinia store 提供給 `Home.vue` / `Detail.vue`。

V1.0 將於 2026-06-30 下架,須改接 V2.1。V2.1 主要差異(見 `migrate-api.md`):類別更名(ScenicSpot→Attraction、Activity→Event)、ID/Name 更名、影像/地址/電話/類別巢狀化、座標上移、多個必填欄位。

約束:
- TDX REST OData API 以 JSON 回傳(`migrate-api.md` 所述 XML 為資料提供者上傳的標準格式,非 API 消費格式),故前端維持 JSON 消費,僅調整欄位名與結構。
- token 取得與 6 小時刷新流程不變。
- 統一 `Card` 介面(`id/name/city/picture/pictureDescription/classes`)維持不變,降低 UI 改動面。

## Goals / Non-Goals

**Goals:**
- 四類資料改接 V2.1 路徑與欄位,列表頁/詳情頁功能與現況一致。
- adapter 吸收所有結構差異,UI 層與 `Card` 介面盡量不變。
- 以 `.env.production` 呼叫正式 API 驗證四類資料可正常取得與顯示。

**Non-Goals:**
- 不在 UI 呈現 V2.1 新增欄位(星級、標章、營運狀態、Geometry 等),僅確保資料正確取得;後續可另案擴充。
- 不改動收藏、分頁、排序等既有功能邏輯。
- 不處理 XML 驗證工具流程(屬資料提供者端,非本前端消費端)。

## Decisions

- **維持 JSON 消費,不引入 XML 解析**:TDX REST API 回 JSON。理由:避免新增 XML parser 依賴與大幅改寫;替代方案(改抓 XML 再解析)成本高且無必要。
- **集中於 adapter 吸收結構差異**:所有巢狀→扁平的轉換(`Images/Image`、`PostalAddress`、`Telephones`、`Classes`)集中在 `adapter.ts`,`Card` 介面不變。替代方案(讓元件直接讀新結構)會擴散改動面,不採用。
- **影像改讀陣列**:由固定 `Picture.PictureUrl1~3` 改為遍歷 `Images` 陣列;詳情頁圖庫由「固定三張」改為「實際筆數」。回退佔位圖邏輯保留。
- **型別重構**:`src/types.ts` 以 V2.1 欄位重寫四類 `*ApiResponse` 介面,移除 `PictureUrl`/`PictureDescription` 型別,新增 `Image`、`PostalAddress`、`Telephone`、`ClassInfo` 等巢狀型別。
- **OData $select/$filter 改用 V2.1 欄位名**:store 內 `getXxxList`/`getXxx` 的 `fields`、`contains(...)`、`eq` 全面換成新欄位名;確認 V2.1 是否支援 `$select` 子欄位選取,若不支援則改抓整筆。
- **路徑常數化**:在 `api/index.ts` 以類別→V2.1 資源名對應,景點函式打 `Attraction`、活動打 `Event`。實際完整路徑前綴於改接時以 production baseURL 對照正式文件確認。

## Risks / Trade-offs

- [V2.1 實際 JSON 欄位名/巢狀層級與 `migrate-api.md` 文字描述可能有出入] → 在 /opsx:apply 階段先以 `.env.production` 呼叫正式 API 取一筆真實回應比對,再定稿 adapter 與 types。
- [`$select` 選取巢狀子欄位語法可能不被支援,導致 400] → 若失敗則移除 `$select` 改抓整筆,或僅選第一層欄位。
- [影像/類別筆數不定造成 UI 破版] → adapter 統一回退與截斷,詳情圖庫以實際筆數渲染並設上限。
- [正式 API 速率限制(429)] → 沿用既有攔截器處理,驗證時降低請求頻率。

## Migration Plan

1. 以 `.env.production` 取得正式 token 並對四類各抓一筆真實 JSON,確認欄位名與巢狀結構。
2. 依真實回應更新 `types.ts` → `adapter.ts` → `api/index.ts` 路徑 → store 查詢欄位。
3. `npm run type-check` 通過後,`npm run dev`(臨時指向 production baseURL),於瀏覽器實際操作 UI(縣市篩選、關鍵字搜尋、點卡片進詳情、收藏/分頁/排序)逐頁驗證列表與詳情,並檢查 console 無 API 錯誤。
4. 回滾策略:改動集中於 4 個檔案,保留 git 還原點;若 V2.1 異常可暫時切回 V1.0 路徑直到下架日。

## Open Questions

- V2.1 正式 API 的完整路徑前綴(`/api/basic/...` vs `/service/odata/V2/...`)需以正式端點實測確認。
- V2.1 是否保留 `$select` 子欄位選取能力。
- 詳情頁是否需呈現 V2.1 新欄位(星級、營運狀態等),待產品決定。
