"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function InkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth > 900;

    if (isReduced || !canHover) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type TrailPoint = { x: number; y: number; t: number };
    const points: TrailPoint[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function handleResize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    const onPointerMove = (e: PointerEvent) => {
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };
    window.addEventListener("pointermove", onPointerMove);

    let isCleared = 0;
    const ticker = () => {
      if (!ctx) return;
      if (!points.length) {
        if (isCleared) return;
        isCleared = 1;
      } else {
        isCleared = 0;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const now = performance.now();
      while (points.length && now - points[0].t > 650) {
        points.shift();
      }

      ctx.lineCap = "round";
      for (let i = 1; i < points.length; i++) {
        const a = 1 - (now - points[i].t) / 650;
        ctx.strokeStyle = `rgba(102, 193, 234, ${a.toFixed(2)})`;
        ctx.lineWidth = 1 + 3 * a;
        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 60,
      }}
      aria-hidden="true"
    />
  );
}

