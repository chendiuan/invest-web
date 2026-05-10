# 人可阜東選股分析工具

台股成長與金流分析的輔助工具，直接串接 TWSE 官方資料，用分數、法人籌碼、月營收三個維度快速篩出值得追蹤的強勢股。

---

## 功能特色

### 三種選股模式

| 模式 | 篩選條件 | 排序方式 | 適合策略 |
|------|---------|---------|---------|
| **嚴格模式** | 月營收 YoY ≥ 30% + 成交金額前 30% | 動能分數 ↓ | 波段、大部位 |
| **成長模式** | 月營收 YoY ≥ 30% | 營收年增率 ↓ | 中長線成長股 |
| **金流模式** | 成交金額前 30% | 成交金額 ↓ | 短線強勢日/週策略 |

### 資料串接

直接從 TWSE 官方 API 讀取，無需手動更新：

- **每日收盤行情**：收盤價、成交金額、漲跌幅
- **三大法人買賣超**：外資、投信、自營商
- **估值資料**：殖利率、本益比、股價淨值比
- **月營收**：當月營收、YoY、MoM、累計 YoY

### 其他功能

- 動能分數篩選（滑桿即時調整）
- 法人條件過濾（任一法人買超 / 外資或投信 / 三大法人合計）
- 產業別過濾
- 個股價格走勢圖（支援 Retina 高解析度）
- 觀察名單（儲存於瀏覽器 localStorage）
- 欄位排序（點擊表頭即可切換升降冪）
- 全文搜尋（代號、公司名稱、產業）
- 響應式版型（桌機 / 平板 / 手機）

---

## 快速開始

### 環境需求

- Node.js 18 以上

### 啟動

```bash
git clone https://github.com/chendiuan/invest-web.git
cd invest-web
node server.mjs
```

開啟瀏覽器前往 [http://localhost:8080](http://localhost:8080)

### 自訂 Port

```bash
PORT=3000 node server.mjs
```

---

## 資料來源

| 資料 | 端點 |
|------|------|
| 每日收盤行情 | `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX` |
| 三大法人買賣超 | `https://www.twse.com.tw/rwd/zh/fund/T86` |
| 本益比 / 殖利率 / 淨值比 | `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d` |
| 個股日成交資訊 | `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY` |
| 上市公司月營收 | `https://openapi.twse.com.tw/v1/opendata/t187ap05_L` |

> 月營收 API 透過本機 `/api/twse/revenue` 代理，避免 CORS 限制。

---

## 專案結構

```
invest-web/
├── index.html                      # 主頁面
├── app.js                          # 前端邏輯（資料擷取、篩選、渲染）
├── styles.css                      # 樣式（深色主題、響應式）
├── server.mjs                      # Node.js 靜態伺服器 + 月營收 API 代理
└── renke-fudong-selection-logic.md # 選股邏輯說明文件
```

---

## 選股邏輯說明

詳細的選股策略、分數計算方式與三種模式的設計思路，請參閱 [`renke-fudong-selection-logic.md`](./renke-fudong-selection-logic.md)。

**核心公式：**

```
好標的 = 營收成長確認 + 市場金流確認
```

**動能分數計算（TWSE 模式）：**

```
動能 = 基底分 + 漲跌幅加權 + 成交金額加權 + 法人籌碼加權 + 營收 YoY 加權
```

---

## 注意事項

- 本工具僅供輔助參考，**不構成任何投資建議**
- TWSE 資料為交易日收盤後更新，非盤中即時資料
- 若 TWSE API 無回應，工具會自動切換為示範資料模式

---

## License

MIT
