import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "apps/web/out");
const port = Number(process.argv[3] ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

async function fileAt(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? path : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const safe = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    const target = resolve(join(root, safe));
    if (!target.startsWith(root + sep) && target !== root) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const candidates = url.pathname.endsWith("/")
      ? [join(target, "index.html")]
      : [target, join(target, "index.html"), `${target}.html`];

    let file = null;
    for (const candidate of candidates) {
      file = await fileAt(candidate);
      if (file) break;
    }
    if (!file) {
      const notFound = join(root, "404.html");
      res.writeHead(404, { "content-type": types[".html"] });
      createReadStream(notFound).pipe(res);
      return;
    }

    const headers = { "content-type": types[extname(file)] ?? "application/octet-stream" };
    if (file.includes(`${sep}_next${sep}`)) headers["cache-control"] = "public, max-age=31536000, immutable";
    res.writeHead(200, headers);
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(500).end("Server error");
  }
}).listen(port, () => {
  console.log(`OUDYN static preview: http://localhost:${port}`);
});
