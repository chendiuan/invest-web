import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT ?? 8080);
const revenueUrl = "https://openapi.twse.com.tw/v1/opendata/t187ap05_L";

// IP 白名單：ALLOWED_IPS=1.2.3.4,5.6.7.8 node server.mjs
// 未設定時不限制
const allowedIps = process.env.ALLOWED_IPS
  ? new Set(process.env.ALLOWED_IPS.split(",").map((ip) => ip.trim()).filter(Boolean))
  : null;

function normalizeIp(ip = "") {
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

function isAllowed(rawIp) {
  if (!allowedIps) return true;
  const ip = normalizeIp(rawIp);
  return ip === "127.0.0.1" || ip === "::1" || allowedIps.has(ip);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer(async (req, res) => {
  const clientIp = normalizeIp(req.socket.remoteAddress ?? "");
  if (!isAllowed(clientIp)) {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    console.log(`[blocked] ${clientIp}`);
    return;
  }

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
