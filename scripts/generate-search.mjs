import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

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
      if (val.startsWith("[") && val.endsWith("]")) {
        result[currentKey] = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      } else {
        result[currentKey] = val;
      }
    }
  });
  return result;
}

function generateSearch() {
  if (!fs.existsSync(POSTS_DIR)) { console.log("✓ Search index skipped (no posts dir)"); return; }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const index = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const meta = parseFrontmatter(raw);
      const content = raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
      return {
        slug,
        title: meta.title || "",
        date: meta.date || "",
        excerpt: meta.excerpt || content.slice(0, 150).replace(/\n/g, " "),
        tags: meta.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const apiDir = path.join(PUBLIC_DIR, "api");
  if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(path.join(apiDir, "search.json"), JSON.stringify(index));
  console.log(`✓ Search index generated (${index.length} items)`);
}

generateSearch();
