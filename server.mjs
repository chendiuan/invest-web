import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

// ── OTC 指數每日排程 ──────────────────────────────────────
const OTC_HISTORY_FILE = join(process.cwd(), "otc-history.json");

async function loadOtcHistory() {
  try {
    const raw = await readFile(OTC_HISTORY_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveOtcHistory(history) {
  const trimmed = history
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-120);
  await writeFile(OTC_HISTORY_FILE, JSON.stringify(trimmed), "utf8");
  return trimmed;
}

async function fetchAndSaveOtcClose() {
  try {
    const res = await fetch(
      `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_o00.tw&_=${Date.now()}`,
      { cache: "no-store", headers: { Referer: "https://mis.twse.com.tw/" } },
    );
    if (!res.ok) return;
    const data = await res.json();
    const item = data.msgArray?.[0];
    if (!item) return;
    const price = parseFloat(item.z) || parseFloat(item.y);
    const date = item.d;
    if (!Number.isFinite(price) || !date) return;

    const history = await loadOtcHistory();
    const idx = history.findIndex((d) => d.date === date);
    if (idx >= 0) history[idx] = { date, close: price };
    else history.push({ date, close: price });
    await saveOtcHistory(history);
    console.log(`[OTC] 已儲存 ${date} 收盤 ${price}`);
  } catch (e) {
    console.warn("[OTC] 排程抓取失敗:", e.message);
  }
}

function isTaiwanWeekday() {
  const now = new Date();
  const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  const day = tw.getDay();
  return day >= 1 && day <= 5;
}

function getTaiwanHHMM() {
  const now = new Date();
  const tw = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  return tw.getHours() * 100 + tw.getMinutes();
}

// 每 5 分鐘檢查一次；週一至週五 14:30–15:00 之間執行一次
let lastSavedDate = null;
setInterval(async () => {
  if (!isTaiwanWeekday()) return;
  const hhmm = getTaiwanHHMM();
  if (hhmm < 1430 || hhmm > 1500) return;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" }).replace(/-/g, "");
  if (lastSavedDate === today) return;
  lastSavedDate = today;
  await fetchAndSaveOtcClose();
}, 5 * 60 * 1000);

// 啟動時若今天還沒有資料且已過 14:30，補抓一次
(async () => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" }).replace(/-/g, "");
  const history = await loadOtcHistory();
  const alreadyHaveToday = history.some((d) => d.date === today);
  if (!alreadyHaveToday && isTaiwanWeekday() && getTaiwanHHMM() >= 1430) {
    await fetchAndSaveOtcClose();
  }
})();
// ─────────────────────────────────────────────────────────

const root = process.cwd();
const port = Number(process.env.PORT ?? 8080);
const revenueUrl = "https://openapi.twse.com.tw/v1/opendata/t187ap05_L";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/twse/revenue") {
      const upstream = await fetch(revenueUrl, { cache: "no-store" });
      const body = await upstream.text();
      res.writeHead(upstream.ok ? 200 : upstream.status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
      return;
    }

    if (url.pathname === "/api/otc-history") {
      const history = await loadOtcHistory();
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(JSON.stringify(history));
      return;
    }

    if (url.pathname === "/api/tpex/current") {
      const upstream = await fetch(
        `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_o00.tw&_=${Date.now()}`,
        { cache: "no-store", headers: { Referer: "https://mis.twse.com.tw/" } },
      );
      const body = await upstream.text();
      res.writeHead(upstream.ok ? 200 : upstream.status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
      return;
    }

    if (url.pathname === "/api/twse/market-index") {
      const date = url.searchParams.get("date") ?? "";
      const upstream = await fetch(
        `https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=${date}&response=json`,
        { cache: "no-store" },
      );
      const body = await upstream.text();
      res.writeHead(upstream.ok ? 200 : upstream.status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
      return;
    }

    if (url.pathname === "/api/twse/realtime") {
      const symbols = url.searchParams.get("stocks") ?? "";
      const exCh = symbols.split(",").filter(Boolean).map((s) => `tse_${s.trim()}.tw`).join("|");
      const upstream = await fetch(
        `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${exCh}&_=${Date.now()}`,
        { cache: "no-store", headers: { Referer: "https://mis.twse.com.tw/" } },
      );
      const body = await upstream.text();
      res.writeHead(upstream.ok ? 200 : upstream.status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const filePath = normalize(join(root, requested));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": types[extname(filePath)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`可阜選股工具 running at http://0.0.0.0:${port}/`);
});
