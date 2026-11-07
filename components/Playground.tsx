"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Playground() {
  const containerRef = useRef<HTMLElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // Physics balls function for each cell canvas
    function setupBalls(cv: HTMLCanvasElement) {
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      const parent = cv.parentElement;
      if (!parent) return;

      const obstaclesElements = Array.from(parent.querySelectorAll<HTMLElement>(".pill, .oval"));
      let W = 0;
      let H = 0;
      type Ball = { x: number; y: number; vx: number; vy: number; r: number; c: string };
      type Obstacle = { x: number; y: number; r: number };
      let B: Ball[] = [];
      let O: Obstacle[] = [];
      let mx = -999;
      let my = -999;
      let isRunning = false;
      const cols = ["#e8685f", "#f2e58a", "#2f7a57", "#5b63ee"];

      function size() {
        if (!cv || !parent) return;
        const cr = cv.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = cr.width;
        H = cr.height;
        cv.width = W * dpr;
        cv.height = H * dpr;
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Calculate obstacle positions using getBoundingClientRect relative to canvas
        // This guarantees pixel-perfect physics alignment with CSS transformed elements
        O = [];
        obstaclesElements.forEach((el) => {
          const er = el.getBoundingClientRect();
          const cx = er.left - cr.left + er.width / 2;
          const cy = er.top - cr.top + er.height / 2;
          const w = er.width;
          const h = er.height;
          const n = Math.max(1, Math.round(w / h));
          const rad = (h / 2) * 0.92;
          for (let i = 0; i < n; i++) {
            O.push({
              x: cx + (n === 1 ? 0 : (i / (n - 1) - 0.5) * (w - h)),
              y: cy,
              r: rad,
            });
          }
        });
      }

      function mk() {
        if (!W || !H) return;
        const isMobile = window.innerWidth <= 900;
        const R = Math.max(12, Math.min(22, W / 24));
        const maxCount = isMobile ? 16 : 38;
        const n = Math.min(maxCount, Math.round(W / (R * 1.8)));
        B = [];
        for (let i = 0; i < n; i++) {
          B.push({
            x: Math.random() * (W - 2 * R) + R,
            y: -R * (1 + i * 1.5),
            vx: (Math.random() - 0.5) * 50,
            vy: Math.random() * 20,
            r: R,
            c: cols[i % 4],
          });
        }
      }

      function step(dt: number) {
        // Physics update
        for (let i = 0; i < B.length; i++) {
          const a = B[i];
          a.vy += 1500 * dt;
          const dx = a.x - mx;
          const dy = a.y - my;
          const d = Math.hypot(dx, dy);
          const L = a.r + 55;
          if (d < L && d > 0) {
            const f = (1 - d / L) * 2400 * dt;
            a.vx += (dx / d) * f;
            a.vy += (dy / d) * f;
          }
          a.vx *= 0.994;
          a.x += a.vx * dt;
          a.y += a.vy * dt;

          // Side wall boundaries
          if (a.x < a.r) {
            a.x = a.r;
            a.vx *= -0.4;
          }
          if (a.x > W - a.r) {
            a.x = W - a.r;
            a.vx *= -0.4;
          }
          // Floor boundary
          if (a.y > H - a.r) {
            a.y = H - a.r;
            a.vy *= -0.3;
            a.vx *= 0.96;
          }
          // Ceiling boundary
          if (a.y < -H * 1.2 && a.vy < 0) {
            a.vy = 0;
          }

          // Obstacle collisions
          O.forEach((o) => {
            const ex = a.x - o.x;
            const ey = a.y - o.y;
            const e = Math.hypot(ex, ey);
            const m = a.r + o.r;
            if (e < m && e > 0) {
              const nx = ex / e;
              const ny = ey / e;
              a.x = o.x + nx * m;
              a.y = o.y + ny * m;
              const vn = a.vx * nx + a.vy * ny;
              if (vn < 0) {
                a.vx -= 1.35 * vn * nx;
                a.vy -= 1.35 * vn * ny;
              }
            }
          });
        }

        // Ball-ball collisions
        for (let k = 0; k < 2; k++) {
          for (let i = 0; i < B.length; i++) {
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i];
              const b = B[j];
              const ex = b.x - a.x;
              const ey = b.y - a.y;
              const e = Math.hypot(ex, ey);
              const m = a.r + b.r;
              if (e < m && e > 0) {
                const nx = ex / e;
                const ny = ey / e;
                const o = (m - e) / 2;
                a.x -= nx * o;
                a.y -= ny * o;
                b.x += nx * o;
                b.y += ny * o;
                const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                if (vn > 0) {
                  const q = vn * 0.6;
                  a.vx -= q * nx;
                  a.vy -= q * ny;
                  b.vx += q * nx;
                  b.vy += q * ny;
                }
              }
            }
          }
        }
      }

      function draw() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        B.forEach((a) => {
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          ctx.fillStyle = a.c;
          ctx.fill();
        });
      }

      // ScrollTrigger triggers the ball drop right as each cell enters view (exact v5 fidelity)
      const st = ScrollTrigger.create({
        trigger: parent,
        start: "top 92%",
        end: "bottom top",
        onToggle: (self) => {
          isRunning = self.isActive;
          if (isRunning && !B.length) {
            size();
            mk();
            if (isReduced) {
              for (let i = 0; i < 500; i++) step(1 / 120);
              draw();
            }
          }
        },
      });

      const setCoords = (clientX: number, clientY: number) => {
        const r = cv.getBoundingClientRect();
        mx = clientX - r.left;
        my = clientY - r.top;
      };

      const clearCoords = () => {
        mx = -999;
        my = -999;
      };

      const onPointerMove = (e: PointerEvent) => {
        setCoords(e.clientX, e.clientY);
      };

      const onPointerDown = (e: PointerEvent) => {
        setCoords(e.clientX, e.clientY);
        // Playful tap pop: give nearby balls a cheerful upward impulse
        const r = cv.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        B.forEach((b) => {
          const d = Math.hypot(b.x - px, b.y - py);
          if (d < 100) {
            b.vy -= 160 + Math.random() * 120;
            b.vx += (b.x - px) * 2;
          }
        });
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          setCoords(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const onResize = () => {
        if (B.length) {
          size();
          B.forEach((a) => {
            a.x = Math.min(a.x, W - a.r);
            a.y = Math.min(a.y, H - a.r);
          });
        }
      };

      cv.addEventListener("pointerdown", onPointerDown);
      cv.addEventListener("pointermove", onPointerMove);
      cv.addEventListener("pointerleave", clearCoords);
      window.addEventListener("pointerup", clearCoords);
      window.addEventListener("pointercancel", clearCoords);
      cv.addEventListener("touchmove", onTouchMove, { passive: true });
      cv.addEventListener("touchend", clearCoords, { passive: true });
      cv.addEventListener("touchcancel", clearCoords, { passive: true });
      window.addEventListener("resize", onResize);

      // Ticker function
      const tickerFn = (_: unknown, dt: number) => {
        if (!isRunning || isReduced) return;
        const delta = Math.min(dt, 33) / 1000;
        step(delta / 2);
        step(delta / 2);
        draw();
      };
      gsap.ticker.add(tickerFn);

      cleanups.push(() => {
        st.kill();
        cv.removeEventListener("pointerdown", onPointerDown);
        cv.removeEventListener("pointermove", onPointerMove);
        cv.removeEventListener("pointerleave", clearCoords);
        window.removeEventListener("pointerup", clearCoords);
        window.removeEventListener("pointercancel", clearCoords);
        cv.removeEventListener("touchmove", onTouchMove);
        cv.removeEventListener("touchend", clearCoords);
        cv.removeEventListener("touchcancel", clearCoords);
        window.removeEventListener("resize", onResize);
        gsap.ticker.remove(tickerFn);
      });
    }

    if (canvas1Ref.current) setupBalls(canvas1Ref.current);
    if (canvas2Ref.current) setupBalls(canvas2Ref.current);

    // Pill & Oval entrance animation
    let badgeTween: gsap.core.Tween | null = null;
    if (!isReduced) {
      badgeTween = gsap.from(".pill, .oval", {
        scale: 0.7,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".cells",
          start: "top 75%",
        },
      });
    }

    return () => {
      badgeTween?.kill();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <section className="cells" id="play" aria-label="Playground" ref={containerRef}>
        <div className="cr">
          <div className="ct">
            <h2>Not just pages</h2>
          </div>
          <div className="cb">
            <canvas ref={canvas1Ref} />
            <div className="pill">
              ideas{" "}
              <svg
                viewBox="0 0 54 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 21l12-10 9 7 16-15M30 3h10v10" />
              </svg>{" "}
              interfaces
            </div>
          </div>
        </div>

        <div className="cr rv">
          <div className="cb">
            <canvas ref={canvas2Ref} />
            <div className="oval">
              <b>ALWAYS</b>
              <b>LEARNING</b>
            </div>
          </div>
          <div className="ct">
            <h2>I build experiences</h2>
          </div>
        </div>
      </section>

      <div className="scrl">
        <span>Please scroll to see my work</span>
        <b className="px">scroll ↓</b>
      </div>
    </>
  );
}

