# tourism-api Specification

## Purpose
TBD - created by archiving change migrate-tourism-api-v2. Update Purpose after archive.
## Requirements
### Requirement: V2.1 API 請求路徑

系統 SHALL 透過觀光資料 V2.1 路徑取得四類觀光資料,且 baseURL 由 `VITE_API_URL` 環境變數提供。類別名稱對應 MUST 為:景點使用 `Attraction`、活動使用 `Event`、旅宿使用 `Hotel`、餐飲使用 `Restaurant`。

#### Scenario: 取得景點列表使用 Attraction 路徑
- **WHEN** 前端請求景點列表
- **THEN** 系統呼叫 V2.1 的 `Attraction` 資源路徑,而非舊版 `ScenicSpot`

#### Scenario: 取得活動列表使用 Event 路徑
- **WHEN** 前端請求活動列表
- **THEN** 系統呼叫 V2.1 的 `Event` 資源路徑,而非舊版 `Activity`

#### Scenario: 旅宿與餐飲沿用原類別名稱
- **WHEN** 前端請求旅宿或餐飲資料
- **THEN** 系統使用 V2.1 的 `Hotel` 與 `Restaurant` 路徑

### Requirement: 識別與名稱欄位映射

adapter SHALL 將 V2.1 回應的識別與名稱欄位轉換為統一 `Card` 格式的 `id` 與 `name`。景點 MUST 讀取 `AttractionID`/`AttractionName`,活動 MUST 讀取 `EventID`/`EventName`,旅宿讀取 `HotelID`/`HotelName`,餐飲讀取 `RestaurantID`/`RestaurantName`。

#### Scenario: 景點 ID 與名稱轉換
- **WHEN** adapter 處理景點回應項目
- **THEN** `Card.id` 來自 `AttractionID`、`Card.name` 來自 `AttractionName`

#### Scenario: 活動 ID 與名稱轉換
- **WHEN** adapter 處理活動回應項目
- **THEN** `Card.id` 來自 `EventID`、`Card.name` 來自 `EventName`

### Requirement: 影像巢狀結構轉換

adapter SHALL 從 V2.1 的 `Images/Image` 巢狀陣列讀取影像,列表頁取第一張作為 `Card.picture`,詳情頁取多張組成圖庫。當無影像時 SHALL 回退為佔位圖。

#### Scenario: 列表頁取首張影像
- **WHEN** 項目含 `Images` 陣列且至少一筆
- **THEN** `Card.picture` 為第一筆影像的 URL、`Card.pictureDescription` 為其 `Name`

#### Scenario: 無影像時回退佔位圖
- **WHEN** 項目的 `Images` 為空或不存在
- **THEN** `Card.picture` 使用佔位圖 URL

### Requirement: 地址、電話與類別欄位轉換

adapter SHALL 從 V2.1 巢狀結構讀取衍生欄位:縣市取自 `PostalAddress.City`;電話取 `Telephones/Telephone` 第一筆;類別由 `Tags` 字串陣列彙整為 `Card.classes`(`*Classes` 為整數代碼,不採用)。

#### Scenario: 由 PostalAddress 取得縣市
- **WHEN** 項目含 `PostalAddress`
- **THEN** adapter 從 `PostalAddress.City` 取得縣市字串

#### Scenario: 類別彙整為字串陣列
- **WHEN** 項目含 `Tags` 字串陣列
- **THEN** `Card.classes` 為去除空值後的 `Tags` 字串陣列

### Requirement: OData 查詢欄位同步更新

store 組裝 OData 查詢時,`$select` 與 `$filter` SHALL 使用 V2.1 欄位名稱。景點 `$filter` MUST 以 `AttractionName` 比對關鍵字,活動 MUST 以 `EventName` 比對;詳情查詢的 `eq` 條件 MUST 使用對應的 V2.1 ID 欄位。

#### Scenario: 景點關鍵字搜尋
- **WHEN** 使用者以關鍵字搜尋景點
- **THEN** `$filter` 使用 `contains(AttractionName, '<keyword>')`

#### Scenario: 詳情頁以 V2.1 ID 查詢
- **WHEN** 請求單一活動詳情
- **THEN** `$filter` 使用 `EventID eq '<id>'`

### Requirement: 正式 API 驗證

改接完成後,系統 SHALL 能以 `.env.production` 的 `VITE_API_URL` 呼叫正式 TDX V2.1 API,四類列表頁與詳情頁 MUST 正確取得並顯示資料,且無型別檢查錯誤。

#### Scenario: 四類資料正式驗證
- **WHEN** 以 production 環境變數建置並呼叫正式 API
- **THEN** 景點、餐飲、旅宿、活動的列表與詳情頁均成功回傳並渲染資料

### Requirement: UI 操作驗證

改接完成後,SHALL 透過瀏覽器實際操作 UI 驗證 API 串接正確,涵蓋縣市篩選、關鍵字搜尋、卡片點擊進入詳情頁等主要使用者流程,且各流程 MUST 顯示正確資料而非錯誤或空白。

#### Scenario: 縣市篩選與搜尋
- **WHEN** 使用者在列表頁選擇縣市並輸入關鍵字搜尋
- **THEN** 列表更新為對應縣市且名稱符合關鍵字的項目

#### Scenario: 進入詳情頁
- **WHEN** 使用者點擊任一卡片
- **THEN** 導向詳情頁並正確顯示影像、類別、電話、開放時間等欄位

