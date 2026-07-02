import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="sub-page visible">
      {/* Background image */}
      <div className="sub-bg">
        <img
          src="/images/h.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
            filter: "brightness(0.55) saturate(1.1) sepia(0.08)",
          }}
        />
        <div
          className="sub-bg-overlay"
          style={{
            background:
              "linear-gradient(to bottom, rgba(30,25,20,0.3) 0%, rgba(30,25,20,0.6) 50%, rgba(20,15,10,0.85) 100%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link href="/" className="sub-back" style={{ color: "#e8b88a" }}>
        ← 戻る
      </Link>

      {/* Content */}
      <main className="sub-main" style={{ maxWidth: 640, width: "100%" }}>
        <h1 className="sub-title" style={{ color: "#e8b88a", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
          文字
        </h1>
        <p className="sub-desc">思い出が行き交う廊下</p>

        {/* Post list */}
        <div style={{ marginTop: "2.5rem", textAlign: "left" }}>
          {posts.length === 0 ? (
            <p className="sub-empty">还没有文章...</p>
          ) : (
            <div className="blog-post-list">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-post-card"
                >
                  <div className="blog-post-title">{post.title}</div>
                  <div className="blog-post-meta">
                    <span>{post.date}</span>
                    {post.readingTime && (
                      <span>{post.readingTime} 分钟阅读</span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <span>{post.tags.join(" · ")}</span>
                    )}
                  </div>
                  {post.excerpt && (
                    <div className="blog-post-excerpt">{post.excerpt}</div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
