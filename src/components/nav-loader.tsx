"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function NavLoader() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const start = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.classList.remove("nav-loader-done");
    bar.classList.add("nav-loader-active");
  }, []);

  const done = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.classList.add("nav-loader-done");
    setTimeout(() => {
      bar?.classList.remove("nav-loader-active", "nav-loader-done");
    }, 400);
  }, []);

  // Detect route change: pathname changed = navigation complete
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      done();
      prevPathname.current = pathname;
    }
  }, [pathname, done]);

  useEffect(() => {
    // Catch clicks on internal links to start the bar
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.target &&
        !link.hasAttribute("download") &&
        link.getAttribute("href") !== "#" &&
        !link.getAttribute("href")?.startsWith("mailto:")
      ) {
        start();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [start]);

  // First load
  useEffect(() => {
    start();
    const t = setTimeout(() => done(), 500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={barRef} className="nav-loader" />;
}
