"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScratchCard from "@/components/ScratchCard";

export default function About() {
  const lineRef = useRef<SVGPathElement>(null);
  const bigTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 900;
    const path = lineRef.current;

    if (isReduced) {
      if (path) gsap.set(path, { strokeDashoffset: 0 });
      gsap.set("#hw, #wu, .p1, .p2, .wd", { opacity: 1, scale: 1, x: 0, rotation: 0, yPercent: 0 });
      return;
    }

    // 1. Background arrow line scroll-scrubbed drawing (exact fidelity to v5 design)
    let pathAnim: gsap.core.Tween | null = null;
    if (path) {
      const len = path.getTotalLength() || 1350;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      pathAnim = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".ab",
          start: isMobile ? "top 85%" : "top 80%",
          end: isMobile ? "center 35%" : "center 40%",
          scrub: 1,
        },
      });
    }

    // 2. "about me!" handwriting badge swing-in
    const hwAnim = gsap.from("#hw", {
      rotation: -30,
      opacity: 0,
      x: -80,
      duration: 0.8,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: ".ab",
        start: "top 70%",
      },
    });

    // 3. "what’s up" boxed badge pop-in with corner anchors
    const wuAnim = gsap.from("#wu", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: "#wu",
        start: "top 85%",
      },
    });

    // 4. Big statement text word-by-word smooth reveal (fluid, zero scroll-freeze illusion)
    const words = bigTextRef.current?.querySelectorAll(".wd");
    let bigAnim: gsap.core.Tween | null = null;
    if (words && words.length > 0) {
      bigAnim = gsap.from(words, {
        y: 18,
        opacity: 0,
        stagger: 0.025,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#big",
          start: isMobile ? "top 85%" : "top 80%",
        },
      });
    }

    // 5. Polaroids scroll-scrubbed slide-in from left and right with rotation
    const dist = isMobile ? 120 : 300;
    const rot = isMobile ? 16 : 40;

    const p1Anim = gsap.from(".p1", {
      x: -dist,
      rotation: -rot,
      opacity: 0,
      scrollTrigger: {
        trigger: ".ab",
        start: isMobile ? "top 50%" : "center 80%",
        end: isMobile ? "bottom 90%" : "bottom 80%",
        scrub: 1,
      },
    });

    const p2Anim = gsap.from(".p2", {
      x: dist,
      rotation: rot,
      opacity: 0,
      scrollTrigger: {
        trigger: ".ab",
        start: isMobile ? "top 50%" : "center 80%",
        end: isMobile ? "bottom 90%" : "bottom 80%",
        scrub: 1,
      },
    });

    // 6. Interactive pin-tack pendulum wobble on hover for polaroids
    const pols = document.querySelectorAll<HTMLElement>(".pol");
    const polCleanups: Array<() => void> = [];
    if (!isReduced) {
      pols.forEach((pol, i) => {
        const onEnter = () => {
          gsap.to(pol, {
            rotation: (i === 0 ? -8 : 7) + (i === 0 ? 5 : -5),
            scale: 1.05,
            duration: 0.22,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        pol.addEventListener("pointerenter", onEnter);
        polCleanups.push(() => pol.removeEventListener("pointerenter", onEnter));
      });
    }

    return () => {
      pathAnim?.kill();
      hwAnim.kill();
      wuAnim.kill();
      bigAnim?.kill();
      p1Anim.kill();
      p2Anim.kill();
      polCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section className="ab" id="about">
      <svg
        className="sq"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="ln-arr"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#999" />
          </marker>
        </defs>
        <path
          id="ln"
          ref={lineRef}
          d="M-10 420C300 300 600 140 900 130S1150 220 1220 250"
          fill="none"
          stroke="#999"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#ln-arr)"
        />
      </svg>

      <div className="hw hd" id="hw">
        about me!
      </div>
      <div className="wu" id="wu">
        what’s up
        <i style={{ left: -9, top: -9 }} />
        <i style={{ right: -9, top: -9 }} />
        <i style={{ left: -9, bottom: -9 }} />
        <i style={{ right: -9, bottom: -9 }} />
      </div>

      <p className="big" id="big" ref={bigTextRef}>
        <span className="wd">I’m</span>{" "}
        <span className="wd">Steffi</span>{" "}
        <span className="wd">
          <span className="ph" />
        </span>{" "}
        <span className="wd">a</span>{" "}
        <span className="wd">front-end</span>{" "}
        <span className="wd">web</span>{" "}
        <span className="wd">developer</span>{" "}
        <span className="wd">who</span>{" "}
        <span className="wd">gets</span>{" "}
        <span className="wd">excited</span>{" "}
        <span className="wd">
          <span className="ic" style={{ background: "var(--gold)", borderRadius: "20%" }}>
            ✚
          </span>
        </span>{" "}
        <span className="wd">about</span>{" "}
        <span className="wd">turning</span>{" "}
        <span className="wd">complex</span>{" "}
        <span className="wd">problems</span>{" "}
        <span className="wd">into</span>{" "}
        <span className="wd">simple</span>{" "}
        <span className="wd">interfaces</span>{" "}
        <span className="wd">
          <span
            className="ic"
            style={{
              background: "var(--red)",
              borderRadius: "20% 20% 50% 50%",
            }}
          />
        </span>
      </p>

      {/* Floating Polaroids */}
      <div className="pol p1" title="2025 - Mikasa">
        <div
          style={{
            backgroundImage: "url('/mikasa.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
        <b>2025</b>
      </div>
      <div className="pol p2" title="Scratch to reveal secret desk art!">
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundImage: "url('/flower.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <ScratchCard />
        </div>
        <b>my desk</b>
      </div>
    </section>
  );
}

