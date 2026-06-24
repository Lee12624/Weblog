import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const SITE_URL = "https://yourdomain.com";
const SITE_TITLE = "Lee | 梦回廊";
const SITE_DESC = "漫步于记忆与想象的廊道 —— 写代码，也做梦。";

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  let currentKey = "";
  match[1].split("\n").forEach((line) => {
    const kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      let val = kv[2].trim().replace(/^["']|["']$/g, "");
      result[currentKey] = val;
    }
  });
  return result;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateRSS() {
  if (!fs.existsSync(POSTS_DIR)) { console.log("✓ RSS skipped (no posts dir)"); return; }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const items = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const meta = parseFrontmatter(raw);
      // Get content after frontmatter
      const content = raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
      return { slug, ...meta, content };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title || "")}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || post.content?.slice(0, 200) || "")}</description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, "rss.xml"), rss.trim());
  console.log(`✓ RSS generated (${items.length} items)`);
}

generateRSS();
