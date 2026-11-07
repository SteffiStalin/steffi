"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CursorAndSpot() {
  const youRef = useRef<HTMLDivElement>(null);
  const youLabelRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch) return;

    const you = youRef.current;
    const spot = spotRef.current;
    const youLabel = youLabelRef.current;
    if (!you || !spot) return;

    const yx = gsap.quickTo(you, "x", { duration: 0.18 });
    const yy = gsap.quickTo(you, "y", { duration: 0.18 });
    const sx = gsap.quickTo(spot, "x", { duration: 0.3, ease: "power3.out" });
    const sy = gsap.quickTo(spot, "y", { duration: 0.3, ease: "power3.out" });

    gsap.set(spot, {
      scale: isReduced ? 1 : 0.6,
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    let isOverZone = false;
    let hasMoved = false;

    function checkZone(e: PointerEvent) {
      const nz = document.getElementById("nmw");
      if (!nz) return;
      const r = nz.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      const inside = x > r.left && x < r.right && y > r.top && y < r.bottom;

      if (inside === isOverZone) return;
      isOverZone = inside;

      if (inside) {
        gsap.to(spot, {
          scale: 1,
          opacity: 1,
          duration: isReduced ? 0.15 : 0.32,
          ease: "expo.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(spot, {
          scale: isReduced ? 1 : 0.85,
          opacity: 0,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!hasMoved) {
        hasMoved = true;
        gsap.to(you, { opacity: 1, duration: 0.15, overwrite: "auto" });
      }

      yx(e.clientX - 10);
      yy(e.clientY - 10);
      sx(e.clientX - 75);
      sy(e.clientY - 75);
      checkZone(e);

      const isMobile = window.innerWidth <= 900;
      if (!isMobile) {
        const mx = e.clientX / window.innerWidth - 0.5;
        const dep = document.querySelectorAll<HTMLElement>("[data-d]");
        dep.forEach((d) => {
          const depth = parseFloat(d.dataset.d || "0");
          gsap.to(d, {
            x: -mx * depth * 2,
            duration: 0.8,
            overwrite: "auto",
          });
        });
      }
    }

    function onPointerLeave() {
      isOverZone = false;
      hasMoved = false;
      gsap.to(spot, { opacity: 0, duration: 0.18, overwrite: "auto" });
      gsap.to(you, { opacity: 0, duration: 0.18, overwrite: "auto" });
    }

    // Dynamic delegated interaction scaling (works seamlessly across page, modals, and drawers)
    function onPointerOver(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, .cd, .bx, .cv-close, .cv-btn, [role='button'], input, textarea"
        )
      ) {
        if (youLabel) gsap.to(youLabel, { scale: 1.25, duration: 0.2 });
        const dot = you?.querySelector("i");
        if (dot) gsap.to(dot, { scale: 1.4, duration: 0.2 });
      }
    }

    function onPointerOut(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, .cd, .bx, .cv-close, .cv-btn, [role='button'], input, textarea"
        )
      ) {
        if (youLabel) gsap.to(youLabel, { scale: 1, duration: 0.2 });
        const dot = you?.querySelector("i");
        if (dot) gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    }

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <>
      <div id="you" ref={youRef} aria-hidden="true">
        <i />
        <b ref={youLabelRef}>YOU</b>
      </div>
      <div id="spot" ref={spotRef} aria-hidden="true">
        <i style={{ left: -11, top: -11 }} />
        <i style={{ right: -11, top: -11 }} />
        <i style={{ left: -11, bottom: -11 }} />
        <i style={{ right: -11, bottom: -11 }} />
      </div>
    </>
  );
}

