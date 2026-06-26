import fs from "fs";
import path from "path";
import { markdownToHtml } from "./markdown";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  readingTime?: number;
}

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.(mdx|md)$/.test(f));

  const posts = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const frontmatter = parseFrontmatter(content);
    const wordCount = content.replace(/```[\s\S]*?```/g, "").length;
    const readingTime = Math.max(1, Math.round(wordCount / 400));

    return {
      slug,
      ...frontmatter,
      readingTime,
    } as PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): {
  meta: PostMeta;
  content: string;
  html: string;
} | null {
  let filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = parseMdxContent(raw);
  const frontmatter = parseFrontmatter(raw);

  return {
    meta: {
      slug,
      ...frontmatter,
    } as PostMeta,
    content,
    html: markdownToHtml(content),
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

interface Frontmatter {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

function parseFrontmatter(mdx: string): Frontmatter {
  const match = mdx.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { title: "", date: "" };
  const raw = match[1];
  const result: Record<string, unknown> = {};
  let currentKey = "";

  raw.split(/\r?\n/).forEach((line) => {
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        result[currentKey] = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      } else {
        result[currentKey] = val.replace(/^["']|["']$/g, "");
      }
    }
  });

  return {
    title: (result.title as string) || "",
    date: (result.date as string) || "",
    excerpt: result.excerpt as string | undefined,
    tags: result.tags as string[] | undefined,
  } as Frontmatter;
}

function parseMdxContent(raw: string): { content: string } {
  const parts = raw.split(/^---\r?\n[\s\S]*?\r?\n---/);
  return { content: parts.slice(1).join("---").trim() };
}
