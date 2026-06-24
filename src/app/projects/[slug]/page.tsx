import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

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
            filter: "brightness(0.5) saturate(1.3)",
          }}
        />
        <div
          className="sub-bg-overlay"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,30,50,0.4) 0%, rgba(15,25,45,0.7) 50%, rgba(10,15,30,0.92) 100%)",
          }}
        />
      </div>

      {/* Back link */}
      <Link href="/projects" className="sub-back" style={{ color: "#7eb8da" }}>
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
            color: "#7eb8da",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            marginBottom: "0.5rem",
            letterSpacing: "0.04em",
          }}
        >
          {project.meta.title}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            fontSize: "0.85rem",
            color: "rgba(237,224,228,0.4)",
            marginBottom: "1.5rem",
          }}
        >
          <span>{project.meta.date}</span>
          {project.meta.tech && project.meta.tech.length > 0 && (
            <span>{project.meta.tech.join(" · ")}</span>
          )}
        </div>

        {/* Links */}
        {(project.meta.link || project.meta.github) && (
          <div style={{ display: "flex", gap: "0.8rem", marginBottom: "2rem" }}>
            {project.meta.link && (
              <a
                href={project.meta.link}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-link"
              >
                🔗 访问
              </a>
            )}
            {project.meta.github && (
              <a
                href={project.meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-link"
              >
                🐙 GitHub
              </a>
            )}
          </div>
        )}

        {/* Rendered HTML */}
        <div
          className="blog-content"
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "rgba(237,224,228,0.85)",
          }}
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
      </main>
    </div>
  );
}
