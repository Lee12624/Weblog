import fs from "fs";
import path from "path";
import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-static";
export const revalidate = 3600;

function getAboutContent() {
  const filePath = path.join(process.cwd(), "content/about.md");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const frontmatter = parseFrontmatter(raw);
  const content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").trim();

  return {
    title: frontmatter.title || "关于",
    subtitle: frontmatter.subtitle || "",
    html: markdownToHtml(content),
  };
}

function parseFrontmatter(md: string): Record<string, string> {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) result[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  });
  return result;
}

export default function AboutPage() {
  const data = getAboutContent();

  if (!data) {
    return (
      <div className="sub-page visible">
        <div className="sub-bg">
          <img
            src="/images/my.jpg"
            alt=""
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "brightness(0.5) saturate(1.0)",
            }}
          />
          <div
            className="sub-bg-overlay"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,15,30,0.3) 0%, rgba(20,15,30,0.6) 50%, rgba(15,10,25,0.9) 100%)",
            }}
          />
        </div>
        <Link href="/" className="sub-back" style={{ color: "#c9a0dc" }}>
          ← 戻る
        </Link>
        <main className="sub-main">
          <h1 className="sub-title" style={{ color: "#c9a0dc", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            关于
          </h1>
          <p className="sub-empty">内容准备中...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="sub-page visible">
      {/* Background image */}
      <div className="sub-bg">
        <img
          src="/images/my.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            filter: "brightness(0.5) saturate(1.0)",
          }}
        />
        <div
          className="sub-bg-overlay"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,15,30,0.3) 0%, rgba(20,15,30,0.6) 50%, rgba(15,10,25,0.9) 100%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link href="/" className="sub-back" style={{ color: "#c9a0dc" }}>
        ← 戻る
      </Link>

      {/* Content */}
      <main
        className="sub-main"
        style={{ maxWidth: 640, width: "100%", textAlign: "left" }}
      >
        <h1
          className="sub-title"
          style={{ color: "#c9a0dc", fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="sub-desc" style={{ marginBottom: "2rem" }}>
            {data.subtitle}
          </p>
        )}

        <div
          className="blog-content"
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "rgba(237,224,228,0.85)",
          }}
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </main>
    </div>
  );
}
