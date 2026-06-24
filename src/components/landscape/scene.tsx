"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   FALLING SAKURA PETALS
   ═══════════════════════════════════════════════════════════ */
function SakuraPetals() {
  const petals = useRef<
    { left: string; delay: string; dur: string; size: string; drift: string }[]
  >([]);

  if (petals.current.length === 0) {
    petals.current = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      dur: `${7 + Math.random() * 8}s`,
      size: `${6 + Math.random() * 18}px`,
      drift: `${(Math.random() - 0.5) * 100}px`,
    }));
  }

  return (
    <div className="petal-field" aria-hidden="true">
      {petals.current.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.dur,
              width: p.size,
              height: p.size,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE — 樱岛麻衣
   ═══════════════════════════════════════════════════════════ */
export default function MainPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <div className="main-page">
      {/* ── Background ── */}
      <div className="main-bg-base" />

      {/* 樱岛麻衣 image as full-screen background */}
      <div className="main-hero-img">
        <img
          src="/images/主页.jpg"
          alt="桜島麻衣"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 25%",
            filter: "brightness(0.85) saturate(1.2) blur(3px)",
          }}
        />
        {/* Gradient fades — darken edges, focus on Mai */}
        <div className="main-img-fade-top" />
        <div className="main-img-fade-bottom" />
        <div className="main-img-fade-left" />
      </div>

      {/* ── Sakura petals ── */}
      <SakuraPetals />

      {/* ── Content overlay ── */}
      <main className={`main-overlay ${loaded ? "visible" : ""}`}>
        {/* Site title */}
        <div className="main-title-block">
          <span className="main-name-en">Lee</span>
          <span className="main-name-sep">|</span>
          <span className="main-name-cn">梦回廊</span>
        </div>

        <p className="main-tagline">
          思いを綴る、桜の廊下で
        </p>

        {/* ── Three nav buttons ── */}
        <nav className="main-nav">
          <Link href="/blog" className="main-nav-card" style={{ animationDelay: "0.1s" }}>
            <span className="nav-card-icon">文</span>
            <span className="nav-card-label">文字</span>
          </Link>
          <Link href="/projects" className="main-nav-card" style={{ animationDelay: "0.2s" }}>
            <span className="nav-card-icon">造</span>
            <span className="nav-card-label">造物</span>
          </Link>
          <Link href="/about" className="main-nav-card" style={{ animationDelay: "0.3s" }}>
            <span className="nav-card-icon">鏡</span>
            <span className="nav-card-label">关于</span>
          </Link>
        </nav>

        {/* Footer */}
        <footer className="main-footer">
          Lee · 梦回廊 · 写代码，也做梦
        </footer>
      </main>
    </div>
  );
}
