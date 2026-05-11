const SAMPLE_STOCKS = [
  {
    symbol: "2330",
    name: "台積電",
    sector: "半導體",
    momentum: 8.9,
    foreignBuyDays: 5,
    trustBuyDays: 2,
    revenueYoY: 24.8,
    risk: "正常",
    events: ["AI 伺服器需求延續", "外資連續加碼，成交量高於 20 日均量"],
    prices: [786, 792, 805, 812, 806, 828, 842, 858, 866, 881, 894, 910],
  },
  {
    symbol: "2317",
    name: "鴻海",
    sector: "電子代工",
    momentum: 8.1,
    foreignBuyDays: 4,
    trustBuyDays: 1,
    revenueYoY: 15.2,
    risk: "正常",
    events: ["電動車與伺服器題材升溫", "投信轉買，短線量能放大"],
    prices: [142, 144, 146, 145, 149, 153, 156, 154, 158, 161, 163, 166],
  },
  {
    symbol: "2382",
    name: "廣達",
    sector: "AI 伺服器",
    momentum: 8.6,
    foreignBuyDays: 2,
    trustBuyDays: 5,
    revenueYoY: 31.6,
    risk: "正常",
    events: ["AI 伺服器出貨動能強", "投信連買達 5 天"],
    prices: [245, 251, 249, 258, 266, 271, 275, 282, 279, 288, 294, 301],
  },
  {
    symbol: "3037",
    name: "欣興",
    sector: "PCB",
    momentum: 7.8,
    foreignBuyDays: 1,
    trustBuyDays: 3,
    revenueYoY: 12.1,
    risk: "正常",
    events: ["ABF 載板報價回穩", "法人買盤回補"],
    prices: [168, 166, 170, 174, 172, 176, 181, 183, 182, 185, 188, 191],
  },
  {
    symbol: "2603",
    name: "長榮",
    sector: "航運",
    momentum: 7.4,
    foreignBuyDays: 0,
    trustBuyDays: 2,
    revenueYoY: 6.4,
    risk: "正常",
    events: ["運價指數反彈", "籌碼尚未形成連續買超"],
    prices: [178, 181, 179, 183, 185, 184, 186, 188, 187, 190, 189, 191],
  },
  {
    symbol: "1519",
    name: "華城",
    sector: "重電",
    momentum: 9.1,
    foreignBuyDays: 3,
    trustBuyDays: 6,
    revenueYoY: 42.3,
    risk: "處置",
    events: ["重電訂單能見度高", "列入處置觀察，短線波動放大"],
    prices: [612, 628, 655, 642, 671, 705, 738, 724, 756, 781, 769, 802],
  },
  {
    symbol: "3661",
    name: "世芯-KY",
    sector: "IC 設計",
    momentum: 6.9,
    foreignBuyDays: 1,
    trustBuyDays: 0,
    revenueYoY: -4.2,
    risk: "正常",
    events: ["客戶拉貨節奏待確認", "營收年增轉弱"],
    prices: [2980, 2925, 2880, 2910, 2865, 2840, 2895, 2930, 2915, 2960, 2945, 2990],
  },
  {
    symbol: "6446",
    name: "藥華藥",
    sector: "生技",
    momentum: 7.9,
    foreignBuyDays: 2,
    trustBuyDays: 2,
    revenueYoY: 28.4,
    risk: "正常",
    events: ["新藥銷售維持成長", "法人買超同步回升"],
    prices: [401, 408, 415, 419, 416, 427, 433, 438, 436, 445, 452, 458],
  },
];

let stocks = [...SAMPLE_STOCKS];
let dataSource = {
  mode: "sample",
  label: "示範資料",
  officialTradingData: false,
};

const state = {
  selectedSymbol: stocks[0].symbol,
  sortKey: "momentum",
  sortDir: "desc",
  activeView: "dashboard",
  mode: "strict",
  windLevel: null,
};

const watchlist = new Set(JSON.parse(localStorage.getItem("renkeFudongWatchlist") ?? "[]"));

const els = {
  stockRows: document.querySelector("#stockRows"),
  navItems: document.querySelectorAll(".nav-item"),
  scannerTitle: document.querySelector("#scannerTitle"),
  scannerDescription: document.querySelector("#scannerDescription"),
  searchInput: document.querySelector("#searchInput"),
  searchResults: document.querySelector("#searchResults"),
  momentumRange: document.querySelector("#momentumRange"),
  momentumValue: document.querySelector("#momentumValue"),
  buyStreakSelect: document.querySelector("#buyStreakSelect"),
  sectorSelect: document.querySelector("#sectorSelect"),
  hideDisposed: document.querySelector("#hideDisposed"),
  resetFilters: document.querySelector("#resetFilters"),
  statQualified: document.querySelector("#statQualified"),
  statInstitutions: document.querySelector("#statInstitutions"),
  statInstitutionsNote: document.querySelector("#statInstitutionsNote"),
  statRiskLabel: document.querySelector("#statRiskLabel"),
  statRisk: document.querySelector("#statRisk"),
  statRiskNote: document.querySelector("#statRiskNote"),
  statRevenue: document.querySelector("#statRevenue"),
  statRevenueNote: document.querySelector("#statRevenueNote"),
  dataSourceLabel: document.querySelector("#dataSourceLabel"),
  detailSymbol: document.querySelector("#detailSymbol"),
  detailName: document.querySelector("#detailName"),
  detailBadge: document.querySelector("#detailBadge"),
  watchlistToggle: document.querySelector("#watchlistToggle"),
  detailForeign: document.querySelector("#detailForeign"),
  detailTrust: document.querySelector("#detailTrust"),
  detailRevenueLabel: document.querySelector("#detailRevenueLabel"),
  detailRevenue: document.querySelector("#detailRevenue"),
  detailRevenueYoY: document.querySelector("#detailRevenueYoY"),
  detailRisk: document.querySelector("#detailRisk"),
  detailYield: document.querySelector("#detailYield"),
  detailValuation: document.querySelector("#detailValuation"),
  eventList: document.querySelector("#eventList"),
  chart: document.querySelector("#priceChart"),
  macdChart: document.querySelector("#macdChart"),
  priceTicker: document.querySelector("#priceTicker"),
  priceClose: document.querySelector("#priceClose"),
  priceChange: document.querySelector("#priceChange"),
  modeTabs: document.querySelectorAll(".mode-tab"),
  sidePanelLabel: document.querySelector("#sidePanelLabel"),
  sidePanelTagline: document.querySelector("#sidePanelTagline"),
  sidePanelDesc: document.querySelector("#sidePanelDesc"),
  windGauge: document.querySelector("#windGauge"),
  windLabel: document.querySelector("#windLabel"),
  windDesc: document.querySelector("#windDesc"),
  kiteSop: document.querySelector("#kiteSop"),
};

const historicalPriceCache = new Map();
const macdPriceCache = new Map();
let realtimeLabel = null;
let realtimeInterval = null;

async function init() {
  bindEvents();
  await loadTwseTradingData();
  loadWindLevel().then(() => { if (state.activeView === "kite") render(); });
  populateSectors();
  render();
  startRealtimeRefresh();
}

function populateSectors() {
  els.sectorSelect.innerHTML = `<option value="all">全部產業</option>`;
  [...new Set(stocks.map((stock) => stock.sector))]
    .sort((a, b) => a.localeCompare(b, "zh-Hant"))
    .forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector;
      option.textContent = sector;
      els.sectorSelect.append(option);
    });
}

async function loadTwseTradingData() {
  setDataSourceLabel("正在讀取 TWSE 交易資訊");

  try {
    const result = await fetchLatestTwseTradingData();
    const [institutionalMap, valuationMap, revenueMap] = await Promise.all([
      fetchOptionalMap(() => fetchTwseInstitutionalMap(result.date), "三大法人"),
      fetchOptionalMap(() => fetchTwseValuationMap(result.date), "估值"),
      fetchOptionalMap(() => fetchTwseRevenueMap(), "月營收"),
    ]);
    stocks = enrichTwseStocks(result.stocks, institutionalMap, valuationMap, revenueMap);
    const loadedSources = ["收盤行情"];
    if (institutionalMap.size > 0) loadedSources.push("三大法人");
    if (valuationMap.size > 0) loadedSources.push("估值");
    if (revenueMap.size > 0) loadedSources.push("月營收");

    dataSource = {
      mode: "twse",
      date: result.date,
      label: `TWSE 官方資料 ${formatDateLabel(result.date)}：${loadedSources.join("、")}`,
      officialTradingData: true,
    };
  } catch (error) {
    dataSource = {
      mode: "sample",
      label: "TWSE 讀取失敗，使用示範資料",
      officialTradingData: false,
    };
    console.warn(error);
  }
}

async function fetchOptionalMap(fetcher, sourceName) {
  try {
    return await fetcher();
  } catch (error) {
    console.warn(`${sourceName}讀取失敗，保留其他 TWSE 資料。`, error);
    return new Map();
  }
}

async function fetchLatestTwseTradingData() {
  const dates = getRecentDateStrings(14);

  for (const date of dates) {
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${date}&type=ALLBUT0999&response=json`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) continue;

    const payload = await response.json();
    if (payload.stat !== "OK") continue;

    const table = payload.tables?.find((item) => {
      const fields = item.fields ?? [];
      return fields.includes("證券代號") && fields.includes("證券名稱") && fields.includes("收盤價");
    });

    if (!table?.data?.length) continue;

    const mapped = mapTwseRowsToStocks(table);
    if (mapped.length > 0) {
      return { date, stocks: mapped };
    }
  }

  throw new Error("TWSE 最近 14 天沒有可用收盤行情。");
}

function mapTwseRowsToStocks(table) {
  const fields = table.fields;
  const index = (name) => fields.indexOf(name);
  const idx = {
    symbol: index("證券代號"),
    name: index("證券名稱"),
    volume: index("成交股數"),
    amount: index("成交金額"),
    open: index("開盤價"),
    high: index("最高價"),
    low: index("最低價"),
    close: index("收盤價"),
    sign: index("漲跌(+/-)"),
    diff: index("漲跌價差"),
    pe: index("本益比"),
  };

  const rows = table.data
    .map((row) => {
      const symbol = String(row[idx.symbol] ?? "").trim();
      const close = parseTwseNumber(row[idx.close]);
      const open = parseTwseNumber(row[idx.open]);
      const high = parseTwseNumber(row[idx.high]);
      const low = parseTwseNumber(row[idx.low]);
      const amount = parseTwseNumber(row[idx.amount]);
      const diff = parseTwseNumber(row[idx.diff]) * parseTwseSign(row[idx.sign]);

      if (!/^\d{4}$/.test(symbol) || !Number.isFinite(close) || close <= 0) return null;

      const previousClose = Math.max(close - diff, 0.01);
      const changePct = ((close - previousClose) / previousClose) * 100;
      const rangePct =
        Number.isFinite(high) && Number.isFinite(low) && close > 0 ? ((high - low) / close) * 100 : 0;

      return {
        symbol,
        name: String(row[idx.name] ?? "").trim(),
        sector: inferSector(symbol),
        close,
        open,
        high,
        low,
        amount,
        changePct,
        priceChange: diff,
        momentum: 5,
        foreignBuyDays: 0,
        trustBuyDays: 0,
        revenueYoY: NaN,
        monthlyRevenue: NaN,
        revenueMonth: "",
        foreignNet: 0,
        trustNet: 0,
        dealerNet: 0,
        institutionalNet: 0,
        dividendYield: NaN,
        pb: NaN,
        risk: diff > 0 ? "收漲" : diff < 0 ? "收跌" : "平盤",
        pe: parseTwseNumber(row[idx.pe]),
        events: [
          `TWSE 收盤價 ${close.toFixed(2)}，漲跌幅 ${changePct.toFixed(2)}%`,
          `成交金額 ${formatMoney(amount)}`,
        ],
        prices: buildIntradayShape(open, high, low, close),
        rangePct,
      };
    })
    .filter(Boolean);

  const maxAmount = Math.max(...rows.map((row) => row.amount), 1);

  return rows
    .map((row) => {
      const liquidityScore = Math.log10(row.amount + 1) / Math.log10(maxAmount + 1);
      const momentum = clamp(5.2 + row.changePct * 0.75 + row.rangePct * 0.18 + liquidityScore * 2.1, 1, 10);
      return {
        ...row,
        momentum: Number(momentum.toFixed(1)),
      };
    })
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 250);
}

async function fetchTwseInstitutionalMap(date) {
  const url = `https://www.twse.com.tw/rwd/zh/fund/T86?date=${date}&selectType=ALLBUT0999&response=json`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return new Map();

  const payload = await response.json();
  if (payload.stat !== "OK" || !Array.isArray(payload.data)) return new Map();

  const fields = payload.fields ?? [];
  const idx = {
    symbol: fields.indexOf("證券代號"),
    foreign: fields.indexOf("外陸資買賣超股數(不含外資自營商)"),
    trust: fields.indexOf("投信買賣超股數"),
    dealer: fields.indexOf("自營商買賣超股數"),
    total: fields.indexOf("三大法人買賣超股數"),
  };

  return new Map(
    payload.data.map((row) => [
      String(row[idx.symbol] ?? "").trim(),
      {
        foreignNet: parseTwseNumber(row[idx.foreign]),
        trustNet: parseTwseNumber(row[idx.trust]),
        dealerNet: parseTwseNumber(row[idx.dealer]),
        institutionalNet: parseTwseNumber(row[idx.total]),
      },
    ]),
  );
}

async function fetchTwseValuationMap(date) {
  const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=${date}&selectType=ALL&response=json`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return new Map();

  const payload = await response.json();
  if (payload.stat !== "OK" || !Array.isArray(payload.data)) return new Map();

  const fields = payload.fields ?? [];
  const idx = {
    symbol: fields.indexOf("證券代號"),
    dividendYield: fields.indexOf("殖利率(%)"),
    pe: fields.indexOf("本益比"),
    pb: fields.indexOf("股價淨值比"),
    fiscal: fields.indexOf("財報年/季"),
  };

  return new Map(
    payload.data.map((row) => [
      String(row[idx.symbol] ?? "").trim(),
      {
        dividendYield: parseTwseNumber(row[idx.dividendYield]),
        pe: parseTwseNumber(row[idx.pe]),
        pb: parseTwseNumber(row[idx.pb]),
        fiscal: String(row[idx.fiscal] ?? "").trim(),
      },
    ]),
  );
}

async function fetchTwseRevenueMap() {
  let response = await fetch("/api/twse/revenue", { cache: "no-store" });
  if (!response.ok) {
    response = await fetch("https://openapi.twse.com.tw/v1/opendata/t187ap05_L", { cache: "no-store" });
  }
  if (!response.ok) return new Map();

  const payload = await response.json();
  if (!Array.isArray(payload)) return new Map();

  return new Map(
    payload.map((row) => [
      String(row["公司代號"] ?? "").trim(),
      {
        revenueMonth: String(row["資料年月"] ?? "").trim(),
        monthlyRevenue: parseTwseNumber(row["營業收入-當月營收"]) * 1000,
        revenueMoM: parseTwseNumber(row["營業收入-上月比較增減(%)"]),
        revenueYoY: parseTwseNumber(row["營業收入-去年同月增減(%)"]),
        cumulativeRevenueYoY: parseTwseNumber(row["累計營業收入-前期比較增減(%)"]),
        revenueNote: String(row["備註"] ?? "").trim(),
      },
    ]),
  );
}

function enrichTwseStocks(baseStocks, institutionalMap, valuationMap, revenueMap) {
  const maxInstitutionalAbs = Math.max(
    ...baseStocks.map((stock) => Math.abs(institutionalMap.get(stock.symbol)?.institutionalNet ?? 0)),
    1,
  );

  return baseStocks
    .map((stock) => {
      const institutional = institutionalMap.get(stock.symbol) ?? {};
      const valuation = valuationMap.get(stock.symbol) ?? {};
      const revenue = revenueMap.get(stock.symbol) ?? {};
      const institutionalNet = institutional.institutionalNet ?? 0;
      const institutionalBoost =
        Math.sign(institutionalNet) *
        (Math.log10(Math.abs(institutionalNet) + 1) / Math.log10(maxInstitutionalAbs + 1));
      const valueBoost = Number.isFinite(valuation.dividendYield) ? Math.min(valuation.dividendYield / 10, 0.5) : 0;
      const revenueBoost = Number.isFinite(revenue.revenueYoY)
        ? revenue.revenueYoY >= 100
          ? 1.5
          : revenue.revenueYoY >= 30
            ? 1
            : revenue.revenueYoY > 0
              ? 0.35
              : -0.8
        : 0;
      const momentum = clamp(stock.momentum + institutionalBoost * 0.9 + valueBoost + revenueBoost, 1, 10);

      return {
        ...stock,
        ...institutional,
        ...valuation,
        ...revenue,
        foreignBuyDays: (institutional.foreignNet ?? 0) > 0 ? 1 : 0,
        trustBuyDays: (institutional.trustNet ?? 0) > 0 ? 1 : 0,
        momentum: Number(momentum.toFixed(1)),
        events: [
          ...stock.events,
          ...("revenueYoY" in revenue
            ? [`最新月營收 ${formatMoney(revenue.monthlyRevenue)}，YoY ${formatPercent(revenue.revenueYoY)}，MoM ${formatPercent(revenue.revenueMoM)}`]
            : []),
          ...("foreignNet" in institutional
            ? [`外資 ${formatShares(institutional.foreignNet)}，投信 ${formatShares(institutional.trustNet)}，三大法人合計 ${formatShares(institutionalNet)}`]
            : []),
          ...("dividendYield" in valuation
            ? [`殖利率 ${formatPercent(valuation.dividendYield)}，本益比 ${formatMetric(valuation.pe)}，股價淨值比 ${formatMetric(valuation.pb)}`]
            : []),
        ],
      };
    })
    .sort((a, b) => b.momentum - a.momentum);
}

function getRecentDateStrings(days) {
  const dates = [];
  const cursor = new Date();
  for (let i = 0; i < days; i += 1) {
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, "0");
    const dd = String(cursor.getDate()).padStart(2, "0");
    dates.push(`${yyyy}${mm}${dd}`);
    cursor.setDate(cursor.getDate() - 1);
  }
  return dates;
}

function parseTwseNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/,/g, "")
    .trim();
  if (cleaned === "" || cleaned === "--") return NaN;
  return Number(cleaned);
}

function parseTwseSign(value) {
  const text = String(value ?? "");
  if (text.includes("green") || text.includes("-")) return -1;
  if (text.includes("red") || text.includes("+")) return 1;
  return 0;
}

function inferSector(symbol) {
  const code = Number(symbol);
  if (code >= 2300 && code < 2500) return "電子";
  if (code >= 3000 && code < 3700) return "電子";
  if (code >= 2600 && code < 2700) return "航運";
  if (code >= 2800 && code < 2900) return "金融";
  if (code >= 1100 && code < 1200) return "水泥";
  if (code >= 1200 && code < 1300) return "食品";
  if (code >= 1300 && code < 1400) return "塑化";
  if (code >= 1400 && code < 1500) return "紡織";
  if (code >= 1500 && code < 1600) return "機電";
  if (code >= 1700 && code < 1800) return "生技化學";
  if (code >= 2000 && code < 2100) return "鋼鐵";
  if (code >= 9900 && code < 10000) return "其他";
  return "上市股票";
}

function buildIntradayShape(open, high, low, close) {
  if (![open, high, low, close].every(Number.isFinite)) {
    return [close, close, close, close, close, close, close, close];
  }

  const firstMid = (open + low) / 2;
  const secondMid = (high + close) / 2;
  return [open, firstMid, low, (open + close) / 2, secondMid, high, (high + close) / 2, close];
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "--";
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)} 億`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)} 萬`;
  return `${value.toFixed(0)} 元`;
}

function formatShares(value) {
  if (!Number.isFinite(value)) return "--";
  const sign = value > 0 ? "+" : "";
  const abs = Math.abs(value);
  if (abs >= 100000000) return `${sign}${(value / 100000000).toFixed(1)} 億股`;
  if (abs >= 10000) return `${sign}${(value / 10000).toFixed(0)} 萬股`;
  return `${sign}${value.toFixed(0)} 股`;
}

function formatPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(2)}%` : "--";
}

function formatMetric(value) {
  return Number.isFinite(value) ? value.toFixed(2) : "--";
}

function formatDateLabel(date) {
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setDataSourceLabel(text, warning = false, live = false) {
  els.dataSourceLabel.textContent = text;
  els.dataSourceLabel.classList.toggle("warning", warning);
  els.dataSourceLabel.classList.toggle("live", live);
}

function isMarketOpen() {
  const now = new Date();
  const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  const day = tw.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = tw.getHours() * 60 + tw.getMinutes();
  return minutes >= 9 * 60 && minutes < 13 * 60 + 30;
}

async function fetchRealtimePrices(symbols) {
  const BATCH = 50;
  const map = new Map();
  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH);
    const res = await fetch(`/api/twse/realtime?stocks=${batch.join(",")}`, { cache: "no-store" });
    if (!res.ok) continue;
    const data = await res.json();
    for (const item of data.msgArray ?? []) {
      const price = parseFloat(item.z) || parseFloat(item.y);
      const ref = parseFloat(item.y);
      if (!Number.isFinite(price) || !Number.isFinite(ref)) continue;
      map.set(item.c, { close: price, priceChange: price - ref, time: item.t ?? "" });
    }
  }
  return map;
}

function applyRealtimePrices(priceMap) {
  for (const stock of stocks) {
    const rt = priceMap.get(stock.symbol);
    if (!rt) continue;
    stock.close = rt.close;
    stock.priceChange = rt.priceChange;
  }
}

async function startRealtimeRefresh() {
  if (!dataSource.officialTradingData || !isMarketOpen()) return;
  const symbols = stocks.map((s) => s.symbol);

  async function refresh() {
    if (!isMarketOpen()) {
      clearInterval(realtimeInterval);
      realtimeInterval = null;
      realtimeLabel = null;
      render();
      return;
    }
    try {
      const priceMap = await fetchRealtimePrices(symbols);
      if (priceMap.size === 0) return;
      applyRealtimePrices(priceMap);
      const sample = priceMap.values().next().value;
      realtimeLabel = `盤中即時 ${sample.time}`;
      render();
    } catch (e) {
      console.warn("realtime fetch failed", e);
    }
  }

  await refresh();
  realtimeInterval = setInterval(refresh, 30_000);
}

function getAmountThreshold(stockList, topFraction) {
  const amounts = stockList.map((s) => s.amount).filter(Number.isFinite).sort((a, b) => b - a);
  if (!amounts.length) return 0;
  return amounts[Math.floor(amounts.length * topFraction)] ?? 0;
}

function applyModeDefaults(mode) {
  state.mode = mode;
  if (mode === "strict") {
    els.hideDisposed.checked = true;
    els.momentumRange.value = "7.5";
    state.sortKey = "momentum";
    state.sortDir = "desc";
  } else if (mode === "growth") {
    els.momentumRange.value = "5";
    state.sortKey = "revenueYoY";
    state.sortDir = "desc";
  } else if (mode === "cashflow") {
    els.hideDisposed.checked = false;
    els.momentumRange.value = "5";
    state.sortKey = "amount";
    state.sortDir = "desc";
  }
}

function bindEvents() {
  [els.momentumRange,
    els.buyStreakSelect,
    els.sectorSelect,
    els.hideDisposed,
  ].forEach((el) => el.addEventListener("input", render));

  els.searchInput.addEventListener("input", () => {
    renderSearchResults();
    render();
  });

  els.searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const match = findSearchMatches(els.searchInput.value)[0];
    if (match) {
      selectStock(match.symbol);
      event.preventDefault();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-box")) {
      closeSearchResults();
    }
  });

  els.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view;
      applyViewDefaults();
      render();
    });
  });

  els.modeTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyModeDefaults(btn.dataset.mode);
      render();
    });
  });

  els.resetFilters.addEventListener("click", () => {
    els.searchInput.value = "";
    els.buyStreakSelect.value = "0";
    els.sectorSelect.value = "all";
    applyModeDefaults("strict");
    render();
  });

  els.watchlistToggle.addEventListener("click", () => {
    if (watchlist.has(state.selectedSymbol)) {
      watchlist.delete(state.selectedSymbol);
    } else {
      watchlist.add(state.selectedSymbol);
    }
    localStorage.setItem("renkeFudongWatchlist", JSON.stringify([...watchlist]));
    render();
  });

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const nextKey = th.dataset.sort;
      if (state.sortKey === nextKey) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = nextKey;
        state.sortDir = "desc";
      }
      render();
    });
  });
}

function findSearchMatches(keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return [];

  return stocks
    .filter((stock) => `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase().includes(normalized))
    .sort((a, b) => {
      const aStarts = a.symbol.startsWith(normalized) || a.name.toLowerCase().startsWith(normalized);
      const bStarts = b.symbol.startsWith(normalized) || b.name.toLowerCase().startsWith(normalized);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      return b.momentum - a.momentum;
    })
    .slice(0, 10);
}

function renderSearchResults() {
  const matches = findSearchMatches(els.searchInput.value);
  els.searchResults.innerHTML = "";

  if (matches.length === 0) {
    closeSearchResults();
    return;
  }

  matches.forEach((stock) => {
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    button.innerHTML = `
      <span>
        <strong>${stock.symbol} ${stock.name}</strong>
        <small>${stock.sector}｜營收 YoY ${formatPercent(stock.revenueYoY)}</small>
      </span>
      <span>
        <strong>${stock.momentum.toFixed(1)}</strong>
        <small>${stock.risk}</small>
      </span>
    `;
    button.addEventListener("click", () => selectStock(stock.symbol));
    els.searchResults.append(button);
  });

  els.searchResults.classList.add("open");
}

function closeSearchResults() {
  els.searchResults.classList.remove("open");
}

function selectStock(symbol) {
  state.selectedSymbol = symbol;
  closeSearchResults();
  render();
}

function applyViewDefaults() {
  if (state.activeView === "events") {
    state.sortKey = "revenueYoY";
    state.sortDir = "desc";
  }

  if (state.activeView === "watchlist") {
    state.sortKey = "momentum";
    state.sortDir = "desc";
  }

  if (state.activeView === "kite") {
    state.sortKey = "revenueYoY";
    state.sortDir = "desc";
    els.momentumRange.value = "5";
  }
}

async function fetchMarketIndexMonthly(dateStr) {
  try {
    const res = await fetch(`/api/twse/market-index?date=${dateStr}`, { cache: "no-store" });
    if (!res.ok) return [];
    const payload = await res.json();
    if (payload.stat !== "OK" || !Array.isArray(payload.data)) return [];
    return payload.data
      .map((row) => parseFloat(String(row[4] ?? "").replace(/,/g, "")))
      .filter((v) => Number.isFinite(v) && v > 0);
  } catch {
    return [];
  }
}

async function loadWindLevel() {
  try {
    const today = dataSource.date ?? new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const prev1 = getPrevMonthDate(today);
    const prev2 = getPrevMonthDate(prev1);
    const [c0, c1, c2] = await Promise.all([
      fetchMarketIndexMonthly(today),
      fetchMarketIndexMonthly(prev1),
      fetchMarketIndexMonthly(prev2),
    ]);
    const closes = [...c2, ...c1, ...c0];
    if (closes.length < 26) { state.windLevel = null; return; }

    const ma20 = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const aboveMa20 = closes[closes.length - 1] > ma20;

    const { histogram } = calcMACD(closes);
    if (histogram.length < 2) { state.windLevel = null; return; }
    const macdTrendUp = histogram[histogram.length - 1] > histogram[histogram.length - 2];

    if (aboveMa20 && macdTrendUp)   state.windLevel = "strong";
    else if (aboveMa20)             state.windLevel = "turbulence";
    else if (macdTrendUp)           state.windLevel = "gust";
    else                            state.windLevel = "calm";
  } catch (e) {
    console.warn("Wind level calc failed:", e);
    state.windLevel = null;
  }
}

function renderWindGauge() {
  const isKite = state.activeView === "kite";
  els.windGauge.classList.toggle("hidden", !isKite);
  els.kiteSop.classList.toggle("hidden", !isKite);
  document.querySelector(".mode-tabs").classList.toggle("hidden", isKite);
  if (!isKite) return;

  const level = state.windLevel;
  const meta = {
    calm:       ["無風", "加權指數低於20MA + MACD往下｜短線休息，波段佈局"],
    turbulence: ["亂流", "加權指數高於20MA + MACD往下｜嚴守紀律或波段佈局"],
    gust:       ["陣風", "加權指數低於20MA + MACD往上｜短線試單，波段佈局"],
    strong:     ["強風", "加權指數高於20MA + MACD往上｜積極追漲或積極布局"],
  };

  document.querySelectorAll(".wind-segment").forEach((el) => {
    el.classList.toggle("active", el.dataset.level === level);
  });

  if (level) {
    els.windLabel.textContent = meta[level][0];
    els.windDesc.textContent = meta[level][1];
    els.windLabel.dataset.level = level;
  } else {
    els.windLabel.textContent = "載入中…";
    els.windDesc.textContent = "正在讀取指數資料";
    delete els.windLabel.dataset.level;
  }
}

function getFilteredStocks() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const minMomentum = Number(els.momentumRange.value);
  const minBuyStreak = Number(els.buyStreakSelect.value);
  const sector = els.sectorSelect.value;
  const amountThreshold = getAmountThreshold(stocks, 0.3);

  return stocks
    .filter((stock) => {
      const maxBuyStreak = Math.max(stock.foreignBuyDays, stock.trustBuyDays);
      const institutionalPass =
        minBuyStreak === 0 ||
        (minBuyStreak === 1 &&
          ((stock.foreignNet ?? 0) > 0 || (stock.trustNet ?? 0) > 0 || (stock.dealerNet ?? 0) > 0)) ||
        (minBuyStreak === 3 && ((stock.foreignNet ?? 0) > 0 || (stock.trustNet ?? 0) > 0)) ||
        (minBuyStreak === 5 && (stock.institutionalNet ?? 0) > 0);
      const searchable = `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase();
      return (
        searchable.includes(keyword) &&
        stock.momentum >= minMomentum &&
        (dataSource.officialTradingData ? institutionalPass : maxBuyStreak >= minBuyStreak) &&
        (sector === "all" || stock.sector === sector) &&
        (!els.hideDisposed.checked || stock.risk !== "處置")
      );
    })
    .filter((stock) => {
      if (state.activeView === "events") {
        return stock.revenueYoY >= 30 || stock.risk !== "平盤" || (stock.institutionalNet ?? 0) > 0;
      }

      if (state.activeView === "watchlist") {
        return watchlist.has(stock.symbol);
      }

      return true;
    })
    .filter((stock) => {
      if (state.activeView === "events" || state.activeView === "watchlist" || state.activeView === "kite") return true;
      if (state.mode === "strict") {
        const volumeOk = !Number.isFinite(stock.amount) || stock.amount >= amountThreshold;
        return stock.revenueYoY >= 30 && volumeOk;
      }
      if (state.mode === "growth") {
        return stock.revenueYoY >= 30;
      }
      if (state.mode === "cashflow") {
        return !Number.isFinite(stock.amount) || stock.amount >= amountThreshold;
      }
      return true;
    })
    .sort((a, b) => {
      const av = a[state.sortKey] ?? -Infinity;
      const bv = b[state.sortKey] ?? -Infinity;
      const result = typeof av === "string" ? av.localeCompare(bv, "zh-Hant") : av - bv;
      return state.sortDir === "asc" ? result : -result;
    });
}

function render() {
  if (realtimeLabel) {
    setDataSourceLabel(realtimeLabel, false, true);
  } else {
    setDataSourceLabel(dataSource.label, dataSource.mode !== "twse");
  }
  renderNavigation();
  renderWindGauge();
  renderSortIndicators();
  els.momentumValue.textContent = Number(els.momentumRange.value).toFixed(1);
  renderStats();

  const filtered = getFilteredStocks();
  if (!filtered.some((stock) => stock.symbol === state.selectedSymbol)) {
    state.selectedSymbol = filtered[0]?.symbol ?? stocks[0].symbol;
  }
  renderRows(filtered);
  renderDetail(stocks.find((stock) => stock.symbol === state.selectedSymbol) ?? stocks[0]);
}

function renderSortIndicators() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    if (th.dataset.sort === state.sortKey) {
      th.dataset.sorted = state.sortDir;
    } else {
      delete th.dataset.sorted;
    }
  });
}

function renderNavigation() {
  els.navItems.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView);
  });

  els.modeTabs.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === state.mode);
  });

  const modeContent = {
    strict: {
      label: "嚴格模式",
      tagline: "YoY > 30% × 成值前 30%",
      desc: "最嚴格篩選，營收真的成長、市場也真的有錢進來，最適合壓大部位。",
    },
    growth: {
      label: "成長模式",
      tagline: "只看營收年增率排列",
      desc: "選當下成長最強的好公司，高機率持續吸引更多金流，適合波段操作。",
    },
    cashflow: {
      label: "金流模式",
      tagline: "只看成交金額排列",
      desc: "看市場大錢有沒有真的進來，不猜基本面，適合強勢日/週短線策略。",
    },
  };

  if (state.activeView === "kite") {
    els.sidePanelLabel.textContent = "週風箏策略";
    els.sidePanelTagline.textContent = "日MACD翻多 × 選最強";
    els.sidePanelDesc.textContent = "9:30 後介入，日MACD剛翻多的第 1–2 天參與，週MACD柱狀體確認向上。";
  } else {
    const mc = modeContent[state.mode];
    els.sidePanelLabel.textContent = mc.label;
    els.sidePanelTagline.textContent = mc.tagline;
    els.sidePanelDesc.textContent = mc.desc;
  }

  const copy = {
    dashboard: {
      title: "總覽清單",
      description: "彙整官方交易、法人、估值與月營收資料，先看整體市場候選股。",
    },
    scanner: {
      title: "選股清單",
      description: "用分數、法人籌碼、營收與事件條件快速縮小觀察範圍。",
    },
    events: {
      title: "事件追蹤",
      description: "優先顯示營收成長、法人買超、收盤波動等需要追蹤的標的。",
    },
    watchlist: {
      title: "觀察名單",
      description: "顯示你加入觀察的股票，資料保存在這台瀏覽器。",
    },
    kite: {
      title: "週風箏選股",
      description: "依日MACD翻多訊號，篩選最強營收或成交金額標的，9:30 後介入。",
    },
  };

  els.scannerTitle.textContent = copy[state.activeView].title;
  els.scannerDescription.textContent = copy[state.activeView].description;
}

function renderStats() {
  const qualified = stocks.filter((stock) => stock.momentum >= Number(els.momentumRange.value));
  const institutionBuying = stocks.filter((stock) =>
    dataSource.officialTradingData
      ? (stock.foreignNet ?? 0) > 0 || (stock.trustNet ?? 0) > 0 || (stock.dealerNet ?? 0) > 0
      : stock.foreignBuyDays >= 1 || stock.trustBuyDays >= 1,
  );
  const stocksWithRevenue = stocks.filter((stock) => Number.isFinite(stock.revenueYoY));
  const avgRevenue =
    stocksWithRevenue.reduce((sum, stock) => sum + stock.revenueYoY, 0) / Math.max(stocksWithRevenue.length, 1);
  const highRevenueGrowth = stocks.filter((stock) => stock.revenueYoY >= 30);

  els.statQualified.textContent = qualified.length;
  els.statInstitutions.textContent = institutionBuying.length;
  els.statInstitutionsNote.textContent = dataSource.officialTradingData
    ? "任一法人買超"
    : "投信或外資連買";
  els.statRiskLabel.textContent = dataSource.officialTradingData ? "收跌檔數" : "處置風險";
  els.statRisk.textContent = dataSource.officialTradingData
    ? stocks.filter((stock) => stock.risk === "收跌").length
    : stocks.filter((stock) => stock.risk === "處置").length;
  els.statRiskNote.textContent = dataSource.officialTradingData ? "以 TWSE 收盤漲跌判斷" : "需降低追價權重";
  els.statRevenue.textContent = dataSource.officialTradingData
    ? highRevenueGrowth.length
    : Number.isFinite(avgRevenue)
      ? `${avgRevenue.toFixed(1)}%`
      : "--";
  els.statRevenueNote.textContent = dataSource.officialTradingData ? "上市公司最新月營收" : "近月營收年增";
}

function renderRows(rows) {
  els.stockRows.innerHTML = "";

  if (rows.length === 0) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const message =
      state.activeView === "watchlist"
        ? "觀察名單目前是空的，請先在個股明細右上角加入股票。"
        : "沒有符合條件的股票，請放寬篩選條件。";
    tr.innerHTML = `<td colspan="8">${message}</td>`;
    els.stockRows.append(tr);
    return;
  }

  rows.forEach((stock) => {
    const tr = document.createElement("tr");
    tr.className = stock.symbol === state.selectedSymbol ? "selected" : "";
    tr.innerHTML = `
      <td><strong>${stock.symbol}</strong></td>
      <td>${stock.name}<br><small>${stock.sector}</small></td>
      <td><span class="score-pill ${stock.momentum < 7.5 ? "mid" : ""}">${stock.momentum.toFixed(1)}</span></td>
      <td>${dataSource.officialTradingData ? formatShares(stock.foreignNet) : `${stock.foreignBuyDays} 天`}</td>
      <td>${dataSource.officialTradingData ? formatShares(stock.trustNet) : `${stock.trustBuyDays} 天`}</td>
      <td>${dataSource.officialTradingData ? formatMoney(stock.amount) : formatPercent(stock.revenueYoY)}</td>
      <td class="${stock.revenueYoY < 0 ? "risk-text" : ""}">${formatPercent(stock.revenueYoY)}</td>
      <td><span class="status-pill ${stock.risk === "處置" ? "warn" : ""}">${stock.risk}</span></td>
    `;
    tr.addEventListener("click", () => {
      selectStock(stock.symbol);
    });
    els.stockRows.append(tr);
  });
}

function renderDetail(stock) {
  els.detailSymbol.textContent = stock.symbol;
  els.detailName.textContent = stock.name;
  els.detailBadge.textContent = stock.momentum.toFixed(1);
  els.watchlistToggle.classList.toggle("active", watchlist.has(stock.symbol));
  els.watchlistToggle.textContent = watchlist.has(stock.symbol) ? "－" : "＋";
  els.watchlistToggle.title = watchlist.has(stock.symbol) ? "移出觀察名單" : "加入觀察名單";
  els.detailForeign.textContent = dataSource.officialTradingData ? formatShares(stock.foreignNet) : `${stock.foreignBuyDays} 天`;
  els.detailTrust.textContent = dataSource.officialTradingData ? formatShares(stock.trustNet) : `${stock.trustBuyDays} 天`;
  els.detailRevenueLabel.textContent = dataSource.officialTradingData ? "成交金額" : "營收 YoY";
  els.detailRevenue.textContent = dataSource.officialTradingData ? formatMoney(stock.amount) : formatPercent(stock.revenueYoY);
  els.detailRevenueYoY.textContent = formatPercent(stock.revenueYoY);
  els.detailRisk.textContent = stock.risk;
  els.detailRisk.className = stock.risk === "處置" ? "risk-text" : "";
  els.detailYield.textContent = formatPercent(stock.dividendYield);
  els.detailValuation.textContent = `PE ${formatMetric(stock.pe)} / PB ${formatMetric(stock.pb)}`;

  els.eventList.innerHTML = "";
  stock.events.forEach((event) => {
    const li = document.createElement("li");
    li.textContent = event;
    els.eventList.append(li);
  });

  renderPriceBar(stock);
  drawChart(stock.prices);
  clearMacdChart(dataSource.officialTradingData ? "MACD 計算中…" : "需要 TWSE 官方資料才能計算 MACD");
  loadHistoricalPrices(stock);
}

function calcEMA(data, period) {
  if (data.length < period) return [];
  const k = 2 / (period + 1);
  const emas = [];
  let ema = data.slice(0, period).reduce((sum, v) => sum + v, 0) / period;
  emas.push(ema);
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emas.push(ema);
  }
  return emas;
}

function calcMACD(prices, fast = 12, slow = 26, signal = 9) {
  const emaFast = calcEMA(prices, fast);
  const emaSlow = calcEMA(prices, slow);
  if (!emaSlow.length) return { macdLine: [], signalLine: [], histogram: [], macdOffset: 0 };

  const shift = slow - fast;
  const macdLine = emaSlow.map((s, i) => emaFast[i + shift] - s);
  const signalLine = calcEMA(macdLine, signal);
  if (!signalLine.length) return { macdLine, signalLine: [], histogram: [], macdOffset: 0 };

  const macdOffset = signal - 1;
  const histogram = signalLine.map((sig, i) => macdLine[i + macdOffset] - sig);
  return { macdLine, signalLine, histogram, macdOffset };
}

function clearMacdChart(message = "") {
  const canvas = els.macdChart;
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 620;
  const cssH = canvas.clientHeight || 110;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.fillStyle = "#08131b";
  ctx.fillRect(0, 0, cssW, cssH);
  if (message) {
    ctx.fillStyle = "#4a6070";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, cssW / 2, cssH / 2);
  }
}

function drawMacdChart(prices) {
  const { macdLine, signalLine, histogram, macdOffset } = calcMACD(prices);

  if (histogram.length < 2) {
    clearMacdChart(`MACD 資料不足（現有 ${prices.length} 日，需至少 35 日）`);
    return;
  }

  const canvas = els.macdChart;
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 620;
  const cssH = canvas.clientHeight || 110;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const width = cssW;
  const height = cssH;
  const padL = 30;
  const padR = 12;
  const padT = 20;
  const padB = 12;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const L = histogram.length;

  ctx.fillStyle = "#08131b";
  ctx.fillRect(0, 0, width, height);

  const allVals = [...histogram, ...signalLine, ...macdLine.slice(macdOffset)];
  const maxAbs = Math.max(...allVals.map(Math.abs), 0.001);
  const yOf = (v) => padT + chartH / 2 - (v / maxAbs) * (chartH / 2);
  const xOf = (i) => padL + (chartW / Math.max(L - 1, 1)) * i;
  const yZero = yOf(0);

  ctx.strokeStyle = "rgba(120, 191, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(padL, yZero);
  ctx.lineTo(width - padR, yZero);
  ctx.stroke();
  ctx.setLineDash([]);

  const barW = Math.max(2, (chartW / L) * 0.65);
  histogram.forEach((val, i) => {
    const x = xOf(i);
    const y = yOf(val);
    const barH = Math.max(Math.abs(yZero - y), 1);
    ctx.fillStyle = val >= 0 ? "rgba(255, 80, 80, 0.65)" : "rgba(50, 185, 120, 0.65)";
    ctx.fillRect(x - barW / 2, Math.min(y, yZero), barW, barH);
  });

  ctx.beginPath();
  histogram.forEach((_, i) => {
    const x = xOf(i);
    const y = yOf(macdLine[i + macdOffset]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#39c9ff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  signalLine.forEach((val, i) => {
    const x = xOf(i);
    const y = yOf(val);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#f4d36b";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#4a6070";
  ctx.font = "10px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("MACD  12/26/9", padL, 4);
  ctx.fillStyle = "#39c9ff";
  ctx.fillText("─ MACD", width - 108, 4);
  ctx.fillStyle = "#f4d36b";
  ctx.fillText("─ Signal", width - 56, 4);
}

function renderPriceBar(stock) {
  els.priceTicker.textContent = `${stock.symbol}　${stock.name}`;
  if (!Number.isFinite(stock.close)) {
    els.priceClose.textContent = "--";
    els.priceChange.textContent = "--";
    els.priceChange.className = "price-change";
    return;
  }
  els.priceClose.textContent = stock.close.toFixed(2);
  const pct = stock.changePct ?? 0;
  const change = stock.priceChange;
  const sign = pct > 0 ? "+" : "";
  els.priceChange.textContent = Number.isFinite(change)
    ? `${sign}${change.toFixed(2)}　（${sign}${pct.toFixed(2)}%）`
    : `${sign}${pct.toFixed(2)}%`;
  els.priceChange.className = `price-change ${pct > 0 ? "up" : pct < 0 ? "down" : ""}`;
}

function getPrevMonthDate(dateStr) {
  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(4, 6));
  if (month === 1) return `${year - 1}1201`;
  return `${year}${String(month - 1).padStart(2, "0")}01`;
}

async function fetchMonthPrices(symbol, date) {
  try {
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=${date}&stockNo=${symbol}&response=json`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    if (payload.stat !== "OK" || !Array.isArray(payload.data)) return [];
    const closeIndex = payload.fields.indexOf("收盤價");
    return payload.data.map((row) => parseTwseNumber(row[closeIndex])).filter(Number.isFinite);
  } catch {
    return [];
  }
}

async function loadHistoricalPrices(stock) {
  if (!dataSource.officialTradingData || !dataSource.date) return;
  const cacheKey = `${stock.symbol}-${dataSource.date}`;

  if (historicalPriceCache.has(cacheKey)) {
    if (state.selectedSymbol === stock.symbol) {
      drawChart(historicalPriceCache.get(cacheKey));
      if (macdPriceCache.has(cacheKey)) drawMacdChart(macdPriceCache.get(cacheKey));
    }
    return;
  }

  try {
    const prevDate = getPrevMonthDate(dataSource.date);
    const prev2Date = getPrevMonthDate(prevDate);
    const [currentPrices, prevPrices, prev2Prices] = await Promise.all([
      fetchMonthPrices(stock.symbol, dataSource.date),
      fetchMonthPrices(stock.symbol, prevDate),
      fetchMonthPrices(stock.symbol, prev2Date),
    ]);

    if (currentPrices.length < 2) return;

    historicalPriceCache.set(cacheKey, currentPrices);
    const combined = [...prev2Prices, ...prevPrices, ...currentPrices];
    macdPriceCache.set(cacheKey, combined);

    if (state.selectedSymbol === stock.symbol) {
      drawChart(currentPrices);
      drawMacdChart(combined);
    }
  } catch (error) {
    console.warn(error);
  }
}

function drawChart(prices) {
  const canvas = els.chart;
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 620;
  const cssH = canvas.clientHeight || 260;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const width = cssW;
  const height = cssH;
  const pad = 30;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const spread = Math.max(max - min, 1);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdfb";
  ctx.fillRect(0, 0, width, height);

  ctx.font = "10px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#17211b";
  for (let i = 0; i < 4; i += 1) {
    const y = pad + ((height - pad * 2) / 3) * i;
    const price = max - (spread / 3) * i;
    ctx.strokeStyle = "#dfe6df";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
    ctx.fillText(price.toFixed(price >= 100 ? 0 : 2), pad - 3, y);
  }

  const points = prices.map((price, index) => ({
    x: pad + ((width - pad * 2) / (prices.length - 1)) * index,
    y: height - pad - ((price - min) / spread) * (height - pad * 2),
  }));

  const gradient = ctx.createLinearGradient(0, pad, 0, height - pad);
  gradient.addColorStop(0, "rgba(25, 116, 90, 0.22)");
  gradient.addColorStop(1, "rgba(25, 116, 90, 0)");

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - pad);
  points.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.lineTo(points[points.length - 1].x, height - pad);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = "#19745a";
  ctx.lineWidth = 3;
  ctx.stroke();
}

init();
