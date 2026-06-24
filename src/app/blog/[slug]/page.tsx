import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="sub-page visible">
      {/* Background image */}
      <div className="sub-bg">
        <img
          src="/images/classroom-bg.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 40%",
            filter: "brightness(0.45) saturate(1.1) sepia(0.08)",
          }}
        />
        <div
          className="sub-bg-overlay"
          style={{
            background:
              "linear-gradient(to bottom, rgba(30,25,20,0.4) 0%, rgba(30,25,20,0.7) 50%, rgba(20,15,10,0.92) 100%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link href="/blog" className="sub-back" style={{ color: "#e8b88a" }}>
        ← 戻る
      </Link>

      {/* Article */}
      <main
        className="sub-main"
        style={{ maxWidth: 680, width: "100%", textAlign: "left" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            color: "#e8b88a",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            marginBottom: "0.5rem",
            letterSpacing: "0.04em",
          }}
        >
          {post.meta.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            fontSize: "0.85rem",
            color: "rgba(237,224,228,0.4)",
            marginBottom: "2rem",
          }}
        >
          <span>{post.meta.date}</span>
          {post.meta.readingTime && <span>{post.meta.readingTime} 分钟阅读</span>}
          {post.meta.tags && post.meta.tags.length > 0 && (
            <span>{post.meta.tags.join(" · ")}</span>
          )}
        </div>

        {/* Rendered HTML */}
        <div
          className="blog-content"
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "rgba(237,224,228,0.85)",
          }}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>
    </div>
  );
}
