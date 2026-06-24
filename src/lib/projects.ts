import fs from "fs";
import path from "path";
import { markdownToHtml } from "./markdown";

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tech?: string[];
  link?: string;
  github?: string;
  date: string;
}

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));

  const projects = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    const frontmatter = parseProjectFrontmatter(raw);

    return { slug, ...frontmatter } as ProjectMeta;
  });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getProjectBySlug(slug: string): {
  meta: ProjectMeta;
  content: string;
  html: string;
} | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const frontmatter = parseProjectFrontmatter(raw);
  const parts = raw.split(/^---\n[\s\S]*?\n---/);
  const content = parts.slice(1).join("---").trim();

  return {
    meta: { slug, ...frontmatter } as ProjectMeta,
    content,
    html: markdownToHtml(content),
  };
}

function parseProjectFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: "", description: "", date: "" };
  const result: Record<string, unknown> = {};
  raw
    .slice(0, match[0].length)
    .split("\n")
    .forEach((line) => {
      const kvMatch = line.match(/^(\w+):\s*(.*)/);
      if (kvMatch) {
        const key = kvMatch[1];
        const val = kvMatch[2].trim();
        if (val.startsWith("[") && val.endsWith("]")) {
          result[key] = val
            .slice(1, -1)
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""));
        } else {
          result[key] = val.replace(/^["']|["']$/g, "");
        }
      }
    });
  return {
    title: (result.title as string) || "",
    description: (result.description as string) || "",
    date: (result.date as string) || "",
    tech: result.tech as string[] | undefined,
    link: result.link as string | undefined,
    github: result.github as string | undefined,
  } as ProjectMeta;
}
