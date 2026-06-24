import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="sub-page visible">
      {/* Background image */}
      <div className="sub-bg">
        <img
          src="/images/rooftop-anime.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            filter: "brightness(0.6) saturate(1.3)",
          }}
        />
        <div
          className="sub-bg-overlay"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,30,50,0.3) 0%, rgba(15,25,45,0.6) 50%, rgba(10,15,30,0.9) 100%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link href="/" className="sub-back" style={{ color: "#7eb8da" }}>
        ← 戻る
      </Link>

      {/* Content */}
      <main className="sub-main" style={{ maxWidth: 640, width: "100%" }}>
        <h1
          className="sub-title"
          style={{ color: "#7eb8da", fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          造物
        </h1>
        <p className="sub-desc">屋上から見上げる星空</p>

        {/* Project list */}
        <div style={{ marginTop: "2.5rem", textAlign: "left" }}>
          {projects.length === 0 ? (
            <p className="sub-empty">还没有项目...</p>
          ) : (
            <div className="blog-post-list">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="blog-post-card"
                  style={{ borderColor: "rgba(126,184,218,0.12)" }}
                >
                  <div className="blog-post-title">{project.title}</div>
                  <div className="blog-post-meta">
                    <span>{project.date}</span>
                    {project.tech && project.tech.length > 0 && (
                      <span>{project.tech.join(" · ")}</span>
                    )}
                  </div>
                  {project.description && (
                    <div className="blog-post-excerpt">{project.description}</div>
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
