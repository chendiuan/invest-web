import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

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
  console.log(`人可阜東選股工具 running at http://0.0.0.0:${port}/`);
});
