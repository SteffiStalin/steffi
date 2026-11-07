"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isReduced) return;

    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;

    // Enable GSAP's adaptive lag smoothing to absorb GC pauses without stutter
    gsap.ticker.lagSmoothing(500, 33);

    // On touch devices (iOS/Android), keep native 120Hz compositor momentum scrolling
    // Only initialize Lenis on desktop pointer/wheel devices
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    if (!isTouch) {
      lenis = new Lenis({
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
    }

    // Smooth anchor navigation (works universally on mobile and desktop)
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = window.innerWidth <= 900 ? -58 : -66;
          if (lenis) {
            lenis.scrollTo(targetEl, {
              offset,
              duration: 1.4,
            });
          } else {
            const top =
              targetEl.getBoundingClientRect().top +
              window.pageYOffset +
              offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Refresh ScrollTrigger after DOM & layout settle (ensures mobile accuracy)
    const r1 = requestAnimationFrame(() => ScrollTrigger.refresh());
    const r2 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(r1);
      clearTimeout(r2);
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      lenis?.destroy();
    };
  }, []);

  return null;
}

