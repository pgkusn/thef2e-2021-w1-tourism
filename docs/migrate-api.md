# 觀光資料 V1.0 改接 V2.1 異動項目整理

## 1. API 請求路徑與格式異動

新版 V2.1 採用的 API 路徑與格式均有顯著調整，原 V1.0 服務預計於 **115 年 06 月 30 日下架**。

| 資料項目     | V1.0 API 路徑            | V2.1 API 路徑 (最新版)                 | 資料格式 |
| :----------- | :----------------------- | :------------------------------------- | :------- |
| **觀光旅宿** | `/v2/Tourism/Hotel`      | `/service/odata/V2/Tourism/Hotel`      | XML      |
| **觀光景點** | `/v2/Tourism/ScenicSpot` | `/service/odata/V2/Tourism/Attraction` | XML      |
| **觀光活動** | `/v2/Tourism/Activity`   | `/service/odata/V2/Tourism/Event`      | XML      |
| **觀光餐飲** | `/v2/Tourism/Restaurant` | `/service/odata/V2/Tourism/Restaurant` | XML      |

---

## 2. 全局通用調整項目

### 2.1 欄位屬性變更

- **語系 (Language)**：由選填變更為**必填**，且描述格式更具體（如 `Zh_tw`）。
- **更新時間 (UpdateTime)**：保留此欄位但變更為**必填**，並全面改用 **ISO8601** 格式。
- **資料提供者 (ProviderID)**：原 `Orgname` 變更為 `ProviderID`，引用共通性標準之「機關代碼」。
- **更新週期 (UpdateInterval)**：**新增**必填欄位，描述檔案更新的週期（秒）。

### 2.2 結構化與巢狀化

- **郵政地址 (PostalAddress)**：原 `Address`、`City`、`ZipCode` 等欄位整合成巢狀結構。
- **聯絡電話 (Telephones)**：原 `Phone` 變更為巢狀結構 `Telephones/Telephone`，支援多筆電話、分機、行動電話等。
- **社群媒體與網站**：新增 `SocialMediaURLs`、`ReservationURLs` 等巢狀欄位，支援多筆社群或預約連結。

---

## 3. 各類別特定異動項目

### 3.1 全台觀光旅宿 (Hotel)

- **新增證號 (HotelLicenseNumber)**：**必填**，描述旅館或民宿的登記證號（如：交觀宿字第 XXXX 號）。
- **星級化數值化 (HotelStars)**：由選填改為**必填**。資料型別從字串轉為**數值 (Integer 0~6)**，無星級為「0」，卓越 5 星級為「6」。
- **描述 (Description)**：由必填變更為**選填**。
- **標章認證**：新增 `HotelCertificationMarks` 巢狀欄位，包含永續標章、環保標章等資訊。
- **營運資訊**：新增總房間數 (`TotalRooms`)、最高/最低房型價格 (`LowestPrice`/`CeilingPrice`) 等細節欄位。

### 3.2 全台觀光景點 (Attraction)

- **描述 (Description)**：由選填變更為**必填**。新版將原本的詳細/簡述欄位合併簡化為單一必填欄位。
- **營運狀態 (ServiceStatus)**：**新增必填欄位**，描述場域目前是否正常營運。
- **影像資料 (Images)**：變更為**必填**。
- **文化資產**：移除舊版 `Level` (古蹟分級)，改用新版 `AssetsClass` 欄位。

### 3.3 全台觀光活動 (Event)

- **時間格式**：`StartDateTime` 與 `EndDateTime` 變更為**必填**，並使用 **ISO8601** 格式。
- **描述與影像**：`Description` 與 `Images` 均變更為**必填**。
- **活動狀態 (EventStatus)**：**新增**選填欄位，描述活動是否取消或延期。

### 3.4 全台觀光餐飲 (Restaurant)

- **描述 (Description)**：由必填變更為**選填**。
- **營運時間 (ServiceTimeInfo)**：由必填變更為**選填**。
- **餐飲特色 (RestaurantFeatures)**：**新增**巢狀欄位，描述店家特色。

---

## 4. 空間資訊與影像處理異動

### 4.1 地理坐標與空間資料

- **坐標欄位上移**：原位於 `Position` 下層的 `PositionLon` 與 `PositionLat` **移至第一層**，且在 V2.1 中均改為**必填**。
- **移除 GeoHash**：全面移除地理空間編碼欄位。
- **新增 Geometry**：新增選填欄位，支援以 **WKT 格式** (Polygon 或 MultiPolygon) 儲存面形空間資料。

### 4.2 影像資料 (Images/Image)

- **彈性多筆**：由舊版固定三張照片 (PictureUrl1~3) 改為**彈性多筆的巢狀結構**。
- **影像名稱必填**：在 `Images/Image` 結構下，影像名稱 (`Name`) 改為**必填**。

---

## 5. 檢核常見問題與建議

- **特殊字元處理**：XML 中若有特殊保留字（如 `&`），須改為轉義字元（如 `&amp;` 或 `&#39;`）。
- **空值處理**：若非必填的數字類或代碼類欄位無資料，建議加上 `xsi:nil="true"`（例如：`<ParkingSpaces xsi:nil="true" />`）。
- **驗證工具**：建議使用官方提供的 [XML 資料驗證工具](https://media.taiwan.net.tw/xml/validator) 先行自我驗證。
