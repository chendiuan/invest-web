// 抓取 2026 年至今所有交易日的三大法人 T86 資料
// 執行方式: node fetch-history.mjs
import { writeFile, readFile } from "node:fs/promises";

const OUTPUT_FILE = new URL("./institutional-history.json", import.meta.url).pathname;
const DELAY_MS = 700;

function getWeekdaysThisYear() {
  const year = new Date().getFullYear();
  const dates = [];
  const cursor = new Date(`${year}-01-01T12:00:00+08:00`);
  const now = new Date();
  while (cursor <= now) {
    const tw = new Date(cursor.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
    const day = tw.getDay();
    if (day >= 1 && day <= 5) {
      const yyyy = tw.getFullYear();
      const mm = String(tw.getMonth() + 1).padStart(2, "0");
      const dd = String(tw.getDate()).padStart(2, "0");
      dates.push(`${yyyy}${mm}${dd}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function parseTwseNum(value) {
  const s = String(value ?? "").replace(/,/g, "").trim();
  if (s === "" || s === "--") return 0;
  return Number(s) || 0;
}

async function fetchT86(dateStr) {
  try {
    const url = `https://www.twse.com.tw/rwd/zh/fund/T86?date=${dateStr}&selectType=ALLBUT0999&response=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    if (!res.ok) return null;
    const payload = await res.json();
    if (payload.stat !== "OK" || !Array.isArray(payload.data)) return null;

    const fields = payload.fields ?? [];
    const si = fields.indexOf("證券代號");
    const ni = fields.indexOf("證券名稱");
    const fi = fields.indexOf("外陸資買賣超股數(不含外資自營商)");
    const ti = fields.indexOf("投信買賣超股數");
    const di = fields.indexOf("自營商買賣超股數");

    const dayData = {};
    const names = {};
    for (const row of payload.data) {
      const symbol = String(row[si] ?? "").trim();
      if (!/^\d{4}$/.test(symbol)) continue;
      dayData[symbol] = [parseTwseNum(row[fi]), parseTwseNum(row[ti]), parseTwseNum(row[di])];
      const name = String(row[ni] ?? "").trim();
      if (name) names[symbol] = name;
    }
    return Object.keys(dayData).length > 100 ? { dayData, names } : null;
  } catch (e) {
    console.error(`  fetch error: ${e.message}`);
    return null;
  }
}

async function main() {
  let db = { names: {}, days: {} };
  try {
    const raw = await readFile(OUTPUT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    // 支援舊格式（純 days object）和新格式（{ names, days }）
    if (parsed.days) {
      db = parsed;
    } else {
      db.days = parsed;
    }
    console.log(`已有 ${Object.keys(db.days).length} 天資料，${Object.keys(db.names).length} 支個股名稱`);
  } catch {
    console.log("從頭開始建立資料庫");
  }

  const dates = getWeekdaysThisYear().filter(d => !(d in db.days));
  console.log(`需要補齊 ${dates.length} 個交易日\n`);

  let fetched = 0;
  for (const date of dates) {
    process.stdout.write(`[${date}] `);
    const result = await fetchT86(date);
    if (result) {
      db.days[date] = result.dayData;
      Object.assign(db.names, result.names);
      fetched++;
      process.stdout.write(`✓ ${Object.keys(result.dayData).length} 檔\n`);
    } else {
      process.stdout.write(`跳過（非交易日或無資料）\n`);
    }
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  await writeFile(OUTPUT_FILE, JSON.stringify(db));
  const tradingDays = Object.keys(db.days).length;
  const stockCount = Object.keys(db.names).length;
  console.log(`\n✓ 完成！資料庫：${tradingDays} 個交易日，${stockCount} 支個股，已存至 institutional-history.json`);
}

main().catch(console.error);
