"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

export default function Skills() {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const bx3Ref = useRef<HTMLDivElement>(null);

  const bioText =
    "I’m an Electronics and Communication Engineering graduate with hands-on experience in coding and web development. Over four years I taught myself Python, SQL and C, practiced on online coding platforms, and completed a web development course as my final-year internship, building projects in HTML, CSS and JavaScript.";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Headings animations
    const hdAnim = gsap.from("#skills .wt .hd", {
      rotation: -24,
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#skills .wt .hd", start: "top 90%", once: true },
    });

    const pxAnim = gsap.from("#skills .wt .px", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#skills .wt", start: "top 85%", once: true },
    });

    // Bio word-by-word scrub reveal
    const bioSpans = bioRef.current?.querySelectorAll("span");
    let bioAnim: gsap.core.Tween | null = null;
    if (bioSpans && bioSpans.length > 0) {
      bioAnim = gsap.fromTo(
        bioSpans,
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 85%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }

    // Grid entrance animation with clean clearProps for fluid scrolling
    const g3Anim = gsap.from("#skills .g3 > .bx", {
      y: 40,
      scale: 0.92,
      opacity: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#skills .g3", start: "top 90%", once: true },
    });

    // 3D Card tilt on hover for fine pointer devices
    const cards = document.querySelectorAll<HTMLElement>("#skills .bx");
    const cardHandlers: Array<{
      el: HTMLElement;
      move: (e: PointerEvent) => void;
      leave: () => void;
    }> = [];

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      cards.forEach((b) => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(b, {
            rotationY: px * 12,
            rotationX: -py * 12,
            x: -3,
            y: -3,
            transformPerspective: 800,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const leave = () => {
          gsap.to(b, {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, .5)",
            overwrite: "auto",
          });
        };
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        cardHandlers.push({ el: b, move, leave });
      });
    }

    // Education section animation
    const eduTitleAnim = gsap.from(".edu h3", {
      yPercent: 70,
      opacity: 0,
      rotationX: -50,
      transformPerspective: 700,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".edu h3", start: "top 88%" },
    });

    const erAnim = gsap.from(".er", {
      x: -70,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".edu", start: "top 75%" },
    });

    // Three.js wireframe shapes inside 3D Design card
    let cleanupThree: (() => void) | null = null;
    const canvas = threeCanvasRef.current;
    const triggerBox = bx3Ref.current;

    if (canvas && triggerBox && !isReduced) {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(96, 96, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
      camera.position.z = 3.2;

      const m3 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true })
      );
      const m4 = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      scene.add(m3, m4);

      let isVisible = false;
      const st = ScrollTrigger.create({
        trigger: triggerBox,
        onToggle: (self) => {
          isVisible = self.isActive;
        },
      });

      const tickerFn = (t: number) => {
        if (!isVisible) return;
        m3.rotation.x = t * 0.6;
        m3.rotation.y = t * 0.8;
        m4.rotation.y = -t * 1.2;
        renderer.render(scene, camera);
      };

      gsap.ticker.add(tickerFn);

      cleanupThree = () => {
        st.kill();
        gsap.ticker.remove(tickerFn);
        renderer.dispose();
      };
    }

    return () => {
      hdAnim.kill();
      pxAnim.kill();
      bioAnim?.kill();
      g3Anim.kill();
      eduTitleAnim.kill();
      erAnim.kill();
      cardHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
      if (cleanupThree) cleanupThree();
    };
  }, []);

  return (
    <section className="dt" id="skills">
      <div className="in">
        <div className="wt" style={{ marginBottom: "34px" }}>
          <div className="hd">a bit about me</div>
          <h2 className="px">
            skills
            <br />
            &amp; education
          </h2>
        </div>

        {/* Word scrub bio */}
        <p className="bio" ref={bioRef}>
          {bioText.split(" ").map((w, idx) => (
            <span key={idx}>{w} </span>
          ))}
        </p>

        {/* Skills Grid */}
        <div className="g3">
          <div className="bx" style={{ background: "var(--gold)" }}>
            <h4>Languages</h4>
            <p>Python · SQL · C · Embedded C</p>
          </div>

          <div className="bx" style={{ background: "var(--grn)" }}>
            <h4>Front-End</h4>
            <p>HTML · CSS · JavaScript · Responsive Design · GSAP</p>
          </div>

          <div className="bx" style={{ background: "var(--sky)" }}>
            <h4>Focus</h4>
            <p>Front-End Web Development</p>
          </div>

          <div className="bx" style={{ background: "var(--pk)" }}>
            <h4>ECE &amp; Hardware</h4>
            <p>
              Arduino · Microcontrollers · Digital Electronics · Circuit Design ·
              Sensors &amp; IoT
            </p>
          </div>

          <div className="bx" style={{ background: "#aedfc5" }}>
            <h4>Tools &amp; Simulation</h4>
            <p>Git · GitHub · VS Code · Proteus · MATLAB · Tinkercad</p>
          </div>

          <div className="bx" style={{ background: "#eed9a2" }}>
            <h4>AI &amp; Data</h4>
            <p>
              Deep Learning · CNN · Data Structures · Problem Solving
            </p>
          </div>

          <div className="bx" style={{ background: "var(--sky)" }}>
            <h4>JS Frameworks</h4>
            <p>React · Next.js · Vue · Node.js · Express</p>
          </div>

          <div className="bx" style={{ background: "var(--gold)" }}>
            <h4>Animation</h4>
            <p>
              GSAP · ScrollTrigger · Lenis · CSS Animations · Framer Motion
            </p>
          </div>

          {/* Live Three.js 3D Wireframe Card */}
          <div
            className="bx bx3"
            ref={bx3Ref}
            style={{ background: "var(--grn)" }}
          >
            <h4>3D Design</h4>
            <p>Three.js · WebGL · Blender · Spline · 3D Web Experiences</p>
            <canvas className="c3" ref={threeCanvasRef} aria-hidden="true" />
          </div>
        </div>

        {/* Education Timeline */}
        <div className="edu">
          <h3 className="px">education</h3>

          <div className="er">
            <span className="mo">2021 — 2025</span>
            <div>
              <b>B.E. · St. Joseph’s College of Engineering</b>
              <p>Affiliated to Anna University</p>
            </div>
          </div>

          <div className="er">
            <span className="mo">2020 — 2021</span>
            <div>
              <b>
                HSLC · Mar Gregoreous Matriculation Higher Secondary School
              </b>
            </div>
          </div>

          <div className="er">
            <span className="mo">2018 — 2019</span>
            <div>
              <b>
                SSLC · Mar Gregoreous Matriculation Higher Secondary School
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

