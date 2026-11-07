"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playPopChime } from "@/utils/sound";

interface HeroProps {
  isLoaded?: boolean;
}

export default function Hero({ isLoaded = true }: HeroProps) {
  const [timeStr, setTimeStr] = useState("6:10:21 PM");
  const [timeOfDay, setTimeOfDay] = useState("noon");
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const animTriggeredRef = useRef(false);

  // Live IST Clock
  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const str = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        setTimeStr(str);

        const hr = parseInt(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            hour12: false,
          }).format(now),
          10
        );
        if (hr >= 6 && hr < 11) setTimeOfDay("morning");
        else if (hr >= 11 && hr < 17) setTimeOfDay("noon");
        else if (hr >= 17 && hr < 20) setTimeOfDay("evening");
        else setTimeOfDay("night");
      } catch {
        setTimeStr(new Date().toLocaleTimeString());
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animations & Physics
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 900;

    // Scroll parallax on hero content without washing out color to grey
    const hlAnim = gsap.to("#hl", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Name letter hover physics
    const letterSpans = document.querySelectorAll<HTMLElement>("#nm span");
    const letterCleanups: Array<() => void> = [];

    letterSpans.forEach((l) => {
      const enterHandler = () => {
        gsap.to(l, {
          y: -30,
          scale: 1.15,
          rotation: gsap.utils.random(-14, 14),
          duration: 0.28,
          ease: "back.out(2.5)",
          yoyo: true,
          repeat: 1,
          overwrite: "auto",
        });
      };
      l.addEventListener("pointerenter", enterHandler);
      letterCleanups.push(() => l.removeEventListener("pointerenter", enterHandler));
    });

    // Run entrance animation once loaded
    let introTl: gsap.core.Timeline | null = null;
    let idleCall: gsap.core.Tween | null = null;

    if (isLoaded && !animTriggeredRef.current) {
      animTriggeredRef.current = true;

      introTl = gsap.timeline();

      if (!isReduced) {
        introTl
          .fromTo(
            "#clk",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          )
          .fromTo(
            "#mn",
            { scale: 0, rotation: -20, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, ease: "back.out(2)", duration: 0.7 },
            "-=0.2"
          )
          .fromTo(
            letterSpans,
            {
              yPercent: 120,
              opacity: 0,
              rotationX: -60,
              scale: 0.85,
              transformPerspective: 800,
            },
            {
              yPercent: 0,
              opacity: 1,
              rotationX: 0,
              scale: 1,
              stagger: 0.08,
              duration: 1.1,
              ease: "elastic.out(1, 0.55)",
              clearProps: "transform,opacity",
            },
            "-=0.3"
          )
          .fromTo(
            ".note.n1",
            { scale: 0, rotation: 35, opacity: 0 },
            { scale: 1, rotation: 12, opacity: 1, ease: "back.out(2.4)", duration: 0.75 },
            "-=0.6"
          )
          .fromTo(
            ".note.n2",
            { scale: 0, rotation: -35, opacity: 0 },
            { scale: 1, rotation: -9, opacity: 1, ease: "back.out(2.4)", duration: 0.75 },
            "-=0.6"
          )
          .fromTo(
            ".bub",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.15, ease: "back.out(2.2)", duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".pl.cp",
            { scale: 0, rotation: 0, opacity: 0 },
            { scale: 1, rotation: 14, opacity: 1, ease: "back.out(2)", duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".pl.pd",
            { scale: 0, rotation: 0, opacity: 0 },
            { scale: 1, rotation: -3, opacity: 1, ease: "back.out(2)", duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            "#av2",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
          )
          .fromTo(
            "#tg, .cm",
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease: "power3.out" },
            "-=0.4"
          );

        // Idle floating motion
        idleCall = gsap.delayedCall(2.8, () => {
          document
            .querySelectorAll<HTMLElement>(".note, .bub, .pl")
            .forEach((e, i) => {
              const sm = window.innerWidth <= 900;
              gsap.to(e, {
                y: "+=" + (sm ? 6 + i : 10 + i * 2),
                rotation: "+=" + (i % 2 ? 2 : -2),
                duration: 2.2 + i * 0.3,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
              });
            });
        });
      } else {
        // Reduced motion: ensure fully visible immediately
        gsap.set(letterSpans, { opacity: 1, yPercent: 0, rotationX: 0, scale: 1 });
        gsap.set(".note, .bub, .pl, #av2, #tg, .cm", { opacity: 1, scale: 1 });
      }
    }

    // Spring physics away from mouse for .bub (desktop only, 0% CPU on mobile)
    let animFrameId: number;
    let cleanPhysics: (() => void) | null = null;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!isReduced && canHover && !isMobile) {
      const dg = Array.from(
        document.querySelectorAll<HTMLElement>(".bub")
      ).map((el) => ({
        el,
        a: (el.querySelector("u") as HTMLElement) || el,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      }));

      let mx = -999;
      let my = -999;
      let isRunning = false;

      function dtick() {
        let hasMovement = false;
        dg.forEach((d) => {
          const r = d.a.getBoundingClientRect();
          const cx = r.left + r.width / 2 - d.x;
          const cy = r.top + r.height / 2 - d.y;
          const dx = cx - mx;
          const dy = cy - my;
          const ds = Math.hypot(dx, dy) || 1;
          const R =
            Math.max(r.width, r.height) / 2 + (isMobile ? 90 : 120);
          let tx = 0;
          let ty = 0;
          const K = isMobile ? 130 : 210;

          if (ds < R) {
            const f = (R - ds) / R;
            tx = (dx / ds) * f * K;
            ty = (dy / ds) * f * K;
            const lo = r.width / 2 + 8;
            const hi = window.innerWidth - r.width / 2 - 8;
            tx = Math.max(lo - cx, Math.min(hi - cx, tx));
          }

          d.vx = (d.vx + (tx - d.x) * 0.11) * 0.8;
          d.vy = (d.vy + (ty - d.y) * 0.11) * 0.8;
          d.x += d.vx;
          d.y += d.vy;

          const rot = Math.max(-28, Math.min(28, d.vx * 2.2));
          const sc = 1 + Math.min(0.18, Math.hypot(d.vx, d.vy) * 0.012);

          d.el.style.translate = `${d.x.toFixed(1)}px ${d.y.toFixed(1)}px`;
          d.el.style.rotate = `${rot.toFixed(1)}deg`;
          d.el.style.scale = sc.toFixed(3);

          if (
            tx ||
            ty ||
            Math.abs(d.vx) > 0.05 ||
            Math.abs(d.vy) > 0.05 ||
            Math.abs(d.x) > 0.3 ||
            Math.abs(d.y) > 0.3
          ) {
            hasMovement = true;
          }
        });

        if (hasMovement) {
          animFrameId = requestAnimationFrame(dtick);
        } else {
          isRunning = false;
        }
      }

      function dgo() {
        if (!isRunning) {
          isRunning = true;
          animFrameId = requestAnimationFrame(dtick);
        }
      }

      function dset(e: PointerEvent) {
        mx = e.clientX;
        my = e.clientY;
        dgo();
      }

      window.addEventListener("pointermove", dset);
      window.addEventListener("pointerdown", dset);

      const pointerUpReset = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") {
          mx = -999;
          my = -999;
          dgo();
        }
      };
      window.addEventListener("pointerup", pointerUpReset);
      window.addEventListener("pointercancel", pointerUpReset);

      const pointerLeaveReset = () => {
        mx = -999;
        my = -999;
        dgo();
      };
      document.addEventListener("pointerleave", pointerLeaveReset);

      // Bubbles tap bounce
      const bubbles = document.querySelectorAll<HTMLElement>(".bub");
      const bubbleDownHandlers: Array<{ el: HTMLElement; fn: () => void }> = [];
      bubbles.forEach((b) => {
        const fn = () => {
          gsap.fromTo(
            b,
            { scale: 0.78, rotation: "+=15" },
            { scale: 1, rotation: 0, duration: 0.9, ease: "elastic.out(1, .35)", overwrite: "auto" }
          );
        };
        b.addEventListener("pointerdown", fn);
        bubbleDownHandlers.push({ el: b, fn });
      });

      cleanPhysics = () => {
        window.removeEventListener("pointermove", dset);
        window.removeEventListener("pointerdown", dset);
        window.removeEventListener("pointerup", pointerUpReset);
        window.removeEventListener("pointercancel", pointerUpReset);
        document.removeEventListener("pointerleave", pointerLeaveReset);
        bubbleDownHandlers.forEach(({ el, fn }) =>
          el.removeEventListener("pointerdown", fn)
        );
        cancelAnimationFrame(animFrameId);
      };
    }

    // Magnetic button physics for .cm
    const cmButtons = document.querySelectorAll<HTMLElement>(".cm");
    const magneticCleanups: Array<() => void> = [];

    cmButtons.forEach((btn) => {
      const move = (e: PointerEvent) => {
        const b = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - b.left - b.width / 2) * 0.3,
          y: (e.clientY - b.top - b.height / 2) * 0.3,
          duration: 0.3,
        });
      };
      const leave = () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, .4)",
        });
      };
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      magneticCleanups.push(() => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      });
    });

    // Direct manipulation draggable stickers with momentum throw & boundary bounce
    const draggableElements = Array.from(
      document.querySelectorAll<HTMLElement>(".note, .pl")
    );
    const stickerCleanups: Array<() => void> = [];

    draggableElements.forEach((el) => {
      let isDragging = false;
      let hasCaptured = false;
      let startX = 0;
      let startY = 0;
      let originClientX = 0;
      let originClientY = 0;
      let curX = 0;
      let curY = 0;
      let lastX = 0;
      let lastY = 0;
      let lastT = 0;
      let vx = 0;
      let vy = 0;

      const onPointerDown = (e: PointerEvent) => {
        originClientX = e.clientX;
        originClientY = e.clientY;
        startX = e.clientX - curX;
        startY = e.clientY - curY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = performance.now();
        vx = 0;
        vy = 0;

        if (e.pointerType === "mouse") {
          isDragging = true;
          hasCaptured = true;
          el.setPointerCapture(e.pointerId);
          el.classList.add("dragging");
          gsap.to(el, { scale: 1.06, duration: 0.15, ease: "power2.out", overwrite: "auto" });
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) {
          // If touching, check if user actually intended to drag horizontally or move significantly
          if (e.pointerType === "touch") {
            const dx = Math.abs(e.clientX - originClientX);
            const dy = Math.abs(e.clientY - originClientY);
            if (dx > 10 || (dy > 10 && dx > dy)) {
              isDragging = true;
              hasCaptured = true;
              try {
                el.setPointerCapture(e.pointerId);
              } catch {}
              el.classList.add("dragging");
              gsap.to(el, { scale: 1.06, duration: 0.15, ease: "power2.out", overwrite: "auto" });
            }
          }
          if (!isDragging) return;
        }

        curX = e.clientX - startX;
        curY = e.clientY - startY;

        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        vx = (e.clientX - lastX) / dt;
        vy = (e.clientY - lastY) / dt;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;

        const tilt = Math.max(-22, Math.min(22, vx * 12));
        el.style.transform = `translate(${curX}px, ${curY}px) rotate(${tilt}deg)`;
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        if (hasCaptured) {
          hasCaptured = false;
          try {
            el.releasePointerCapture(e.pointerId);
          } catch {}
        }
        el.classList.remove("dragging");

        // Momentum inertia with elastic settle
        const throwX = curX + vx * 140;
        const throwY = curY + vy * 140;
        curX = throwX;
        curY = throwY;

        gsap.to(el, {
          x: throwX,
          y: throwY,
          rotation: 0,
          scale: 1,
          duration: 0.75,
          ease: "elastic.out(1, 0.48)",
          overwrite: "auto",
        });
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
      stickerCleanups.push(() => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointercancel", onPointerUp);
      });
    });

    return () => {
      hlAnim.kill();
      introTl?.kill();
      idleCall?.kill();
      gsap.set(letterSpans, { clearProps: "transform,opacity" });
      letterCleanups.forEach((fn) => fn());
      magneticCleanups.forEach((fn) => fn());
      stickerCleanups.forEach((fn) => fn());
      if (cleanPhysics) cleanPhysics();
    };
  }, [isLoaded]);

  const resetStickers = () => {
    const els = document.querySelectorAll<HTMLElement>(".note, .pl");
    gsap.to(els, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.75,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.05,
      clearProps: "transform",
    });
    playPopChime();
  };

  const nameLetters = ["S", "T", "E", "F", "F", "I"];

  return (
    <header className={`hero ${timeOfDay}`} id="top" ref={heroRef}>
      <div className="clk" id="clk">
        <span>{timeStr}</span>
        <button
          className="tdy-btn"
          onClick={resetStickers}
          title="Tidy up stickers"
          aria-label="Reset stickers to initial layout"
        >
          ↺ tidy
        </button>
      </div>

      {/* Interactive floating avatar bubbles with Pikachu */}
      <div className="bub b1" aria-hidden="true" title="Pikachu">
        <u />
      </div>
      <div className="bub b2" aria-hidden="true" title="Pikachu">
        <u />
      </div>

      <div className="hl" id="hl">
        <div className="mn hd" id="mn">
          my name is
          <svg
            width="110"
            height="14"
            viewBox="0 0 110 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 4c30-3 70-3 102 0M14 11c30-3 54-3 80-1" />
          </svg>
        </div>

        <div className="note n1" data-d="20">
          Always learning something new
        </div>
        <div className="note n2" data-d="40">
          Clean code, clear ideas
        </div>

        <br />
        <div className="nmw" id="nmw">
          <h1 className="px nm" id="nm" ref={nameRef}>
            {nameLetters.map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </h1>
          <div className="hd8" aria-hidden="true">
            <i style={{ left: -11, top: -11 }} />
            <i style={{ right: -11, top: -11 }} />
            <i style={{ left: -11, bottom: -11 }} />
            <i style={{ right: -11, bottom: -11 }} />
          </div>
        </div>

        <div className="mo av2" id="av2">
          Open to front-end opportunities
        </div>
      </div>

      {/* Floating callout badges */}
      <div className="pl cp" data-d="25">
        Let’s collab!
      </div>
      <div className="pl pd" data-d="35">
        Code · Create · Repeat
      </div>

      {/* Tagline */}
      <p className="tag" id="tg">
        I build{" "}
        <span className="ic" style={{ background: "var(--grn)", color: "#fff" }}>
          ◎
        </span>{" "}
        clean, responsive websites{" "}
        <span
          className="ic spin"
          style={{ color: "var(--red)", background: "none" }}
        >
          ❋
        </span>
        .
      </p>

      {/* Call to action */}
      <a className="cm" href="#talk">
        <i>»</i>Contact me
      </a>
    </header>
  );
}
