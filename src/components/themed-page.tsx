"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface ThemeConfig {
  bgImage: string;
  bgFilter?: string;
  bgPosition?: string;
  overlay: string;
  accent: string;
  title: string;
  subtitle: string;
  icon: string;
}

export default function ThemedPage({ config }: { config: ThemeConfig }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  return (
    <div className={`sub-page ${visible ? "visible" : ""}`}>
      {/* Background image */}
      <div className="sub-bg">
        <img
          src={config.bgImage}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: config.bgPosition || "center",
            filter: config.bgFilter || "brightness(0.65) saturate(1.2)",
          }}
        />
        <div className="sub-bg-overlay" style={{ background: config.overlay }} />
      </div>

      {/* Back link */}
      <Link href="/" className="sub-back" style={{ color: config.accent }}>
        ← 戻る
      </Link>

      {/* Content */}
      <main className="sub-main">
        <h1 className="sub-title" style={{ color: config.accent, fontSize: "clamp(3rem, 8vw, 6rem)" }}>
          {config.title}
        </h1>
        <p className="sub-desc">{config.subtitle}</p>
        <p className="sub-empty">内容准备中...</p>
      </main>
    </div>
  );
}
