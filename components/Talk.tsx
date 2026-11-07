"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { playPopChime, playTickSound, playPurrSound } from "@/utils/sound";

export default function Talk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Letter entrance animation for "let's talk"
    const headingSpans = headingRef.current?.querySelectorAll(".tk-char");
    let headingAnim: gsap.core.Tween | null = null;
    if (headingSpans && headingSpans.length > 0) {
      headingAnim = gsap.from(headingSpans, {
        y: 120,
        rotation: 12,
        opacity: 0,
        stagger: 0.05,
        ease: "back.out(2)",
        scrollTrigger: { trigger: "#lt", start: "top 85%" },
      });
    }

    // Text scramble animation on .vp hover
    const vpLinks = document.querySelectorAll<HTMLElement>(".tk .vp");
    const vpCleanups: Array<() => void> = [];

    function scramble(el: HTMLElement) {
      const orig = el.dataset.t || (el.dataset.t = el.textContent || "");
      let n = 0;
      const chars = "#%&@$*+?!";
      const id = setInterval(() => {
        el.textContent = orig
          .split("")
          .map((c, j) =>
            j < n || c === " " || c === "↗"
              ? c
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("");
        if (++n > orig.length) {
          clearInterval(id);
          el.textContent = orig;
        }
      }, 28);
    }

    vpLinks.forEach((a) => {
      const onEnter = () => {
        playTickSound();
        scramble(a);
        gsap.to("#you b", { scale: 1.25, duration: 0.2 });
      };
      const onLeave = () => {
        gsap.to("#you b", { scale: 1, duration: 0.2 });
      };
      a.addEventListener("pointerenter", onEnter);
      a.addEventListener("pointerleave", onLeave);
      vpCleanups.push(() => {
        a.removeEventListener("pointerenter", onEnter);
        a.removeEventListener("pointerleave", onLeave);
      });
    });

    // Stagger entrance for action buttons
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let vpAnim: gsap.core.Tween | null = null;
    if (!isReduced && vpLinks.length > 0) {
      vpAnim = gsap.from(vpLinks, {
        y: 26,
        opacity: 0,
        stagger: 0.09,
        duration: 0.75,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".tk", start: "top 78%" },
      });
    }

    // Three.js 3D Interactive Blob
    const cv = canvasRef.current;
    if (!cv) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: cv,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.z = 6.2;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.SphereGeometry(1.25, 56, 56);
    const posArray = geometry.attributes.position.array;
    const b0 = Float32Array.from(posArray);

    const cols = new Float32Array(b0.length);
    const greenColor = new THREE.Color(0x3ecf8e);

    for (let ci = 0; ci < b0.length; ci += 3) {
      const cl = Math.max(
        0,
        (b0[ci] * 0.3 + b0[ci + 1] * 0.6 + b0[ci + 2] * 0.75) / 1.25
      );
      const cf = 0.8 + 0.3 * cl;
      cols[ci] = greenColor.r * cf;
      cols[ci + 1] = greenColor.g * cf;
      cols[ci + 2] = greenColor.b * cf;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(cols, 3));

    const innerMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ vertexColors: true })
    );

    const outlineMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.BackSide })
    );
    outlineMesh.scale.set(1.07, 1.07, 1.01);
    group.add(outlineMesh, innerMesh);

    // Theme color update for blob outline (crisp pure white in dark mode for vibrant cel-shaded look)
    const updateOutlineTheme = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        (!document.documentElement.getAttribute("data-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      outlineMesh.material.color.set(isDark ? 0xffffff : 0x111111);
    };
    updateOutlineTheme();

    // Register global hook for theme toggle
    if (typeof window !== "undefined") {
      (window as unknown as { __so?: () => void }).__so = updateOutlineTheme;
    }

    // Eyes with Pixar Specular Catchlights (The Life Factor)
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const catchlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyesGroup = new THREE.Group();
    [-1, 1].forEach((s) => {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        eyeMaterial
      );
      eye.scale.set(1, 2.4, 0.4);
      eye.position.set(s * 0.3, 0.25, 0);

      // Specular gloss reflection dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        catchlightMaterial
      );
      dot.position.set(0.04, 0.08, 0.12);
      eye.add(dot);

      eyesGroup.add(eye);
    });
    eyesGroup.position.z = 0.62;
    group.add(eyesGroup);

    function resizeCanvas() {
      if (!cv) return;
      const w = cv.clientWidth;
      renderer.setSize(w, w, false);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let px = 0;
    let py = 0;
    function onPointerMove(e: PointerEvent) {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("pointermove", onPointerMove);

    // Scroll-scrub spin
    const spin = { v: 0 };
    const spinAnim = gsap.to(spin, {
      v: Math.PI * 2,
      scrollTrigger: {
        trigger: "#talk",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Pause Three.js WebGL render loop when out of viewport (max mobile battery & 60fps performance)
    let isTalkVisible = false;
    const talkObserver = new IntersectionObserver(
      ([entry]) => {
        isTalkVisible = entry.isIntersecting;
      },
      { rootMargin: "250px" }
    );
    talkObserver.observe(cv);

    // Vertex wave ticker
    const tickerFn = (t: number) => {
      if (!isTalkVisible) return;

      const a = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < a.length; i += 3) {
        const x = b0[i];
        const y = b0[i + 1];
        const z = b0[i + 2];
        const th = Math.atan2(y, x);
        const k =
          1 -
          0.4 *
            Math.cos(4 * th + Math.sin(t * 0.8) * 0.5) *
            (1 - Math.abs(z) / 1.4);
        a[i] = x * k;
        a[i + 1] = y * k;
        a[i + 2] = z * 0.45;
      }
      geometry.attributes.position.needsUpdate = true;

      group.rotation.z = spin.v;
      eyesGroup.rotation.z = -spin.v;
      group.rotation.y += (px * 0.5 - group.rotation.y) * 0.06;
      group.rotation.x += (py * 0.4 - group.rotation.x) * 0.06;
      eyesGroup.position.x += (px * 0.5 - eyesGroup.position.x) * 0.1;
      eyesGroup.position.y += (-py * 0.4 - eyesGroup.position.y) * 0.1;

      renderer.render(scene, camera);
    };

    gsap.ticker.add(tickerFn);

    // Procedural life-like eye blinking
    let blinkTimer: NodeJS.Timeout | number;
    const triggerBlink = () => {
      if (!isTalkVisible) {
        blinkTimer = setTimeout(triggerBlink, 3000);
        return;
      }
      gsap.to(eyesGroup.scale, {
        y: 0.06,
        duration: 0.07,
        ease: "power2.in",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // 25% chance of an adorable double-blink
          if (Math.random() < 0.25) {
            gsap.to(eyesGroup.scale, {
              y: 0.06,
              duration: 0.06,
              delay: 0.08,
              ease: "power2.in",
              yoyo: true,
              repeat: 1,
            });
          }
          blinkTimer = setTimeout(triggerBlink, 2800 + Math.random() * 3200);
        },
      });
    };
    blinkTimer = setTimeout(triggerBlink, 2200);

    // Contextual Link Hover Reactions for Mascot
    const emailLink = document.querySelector<HTMLElement>(".tk a[href^='mailto']");
    const githubLink = document.querySelector<HTMLElement>(".tk a[href*='github']");
    const cvLink = document.querySelector<HTMLElement>(".tk a[href*='Resume.pdf']");

    const onEmailEnter = () => {
      gsap.to(group.scale, { x: 1.14, y: 1.14, z: 1.14, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });
      if (eyesGroup.children[0]) {
        gsap.to(eyesGroup.children[0].scale, { y: 0.1, duration: 0.18, yoyo: true, repeat: 1 });
      }
    };
    const onEmailLeave = () => {
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };

    const onGithubEnter = () => {
      gsap.to(spin, { v: "+=" + Math.PI * 2, duration: 0.75, ease: "power2.out", overwrite: "auto" });
      gsap.fromTo(group.scale, { x: 0.88, y: 1.18 }, { x: 1, y: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)", overwrite: "auto" });
    };

    const onCvEnter = () => {
      gsap.to(group.rotation, { x: "+=0.35", duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" });
    };

    emailLink?.addEventListener("pointerenter", onEmailEnter);
    emailLink?.addEventListener("pointerleave", onEmailLeave);
    githubLink?.addEventListener("pointerenter", onGithubEnter);
    cvLink?.addEventListener("pointerenter", onCvEnter);

    // Direct manipulation silicone squash & slingshot physics on Mascot
    let isBlobDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const onBlobPointerDown = (e: PointerEvent) => {
      isBlobDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      cv.classList.add("grabbing");
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {}
      playPopChime();
      gsap.to(group.scale, {
        x: 1.25,
        y: 0.8,
        z: 1.25,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      // Playful eye squint on tap
      gsap.to(eyesGroup.scale, {
        y: 0.15,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };

    const onBlobPointerMove = (e: PointerEvent) => {
      if (!isBlobDragging) return;
      const dx = (e.clientX - dragStartX) * 0.003;
      const dy = (e.clientY - dragStartY) * 0.003;
      group.scale.set(
        1.25 + Math.min(0.6, Math.abs(dx)),
        Math.max(0.45, 0.8 - Math.min(0.4, Math.abs(dy))),
        1.25
      );
      // Gentle silicone tether displacement
      group.position.x = Math.max(-0.6, Math.min(0.6, dx * 0.5));
      group.position.y = Math.max(-0.6, Math.min(0.6, -dy * 0.5));
    };

    const onBlobPointerUp = (e: PointerEvent) => {
      if (!isBlobDragging) return;
      isBlobDragging = false;
      cv.classList.remove("grabbing");
      try {
        cv.releasePointerCapture(e.pointerId);
      } catch {}
      gsap.to(group.position, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "elastic.out(1.2, 0.35)",
        overwrite: "auto",
      });
      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.85,
        ease: "elastic.out(1.2, 0.35)",
        overwrite: "auto",
      });
      gsap.to(spin, {
        v: "+=" + Math.PI,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Mascot Tamagotchi tickle mode on rapid cursor scrubbing
    let tickleCount = 0;
    let lastTickleX = 0;
    const onCanvasHoverMove = (e: PointerEvent) => {
      if (isBlobDragging) return;
      const dx = Math.abs(e.clientX - lastTickleX);
      if (dx > 18) {
        tickleCount++;
        lastTickleX = e.clientX;
        if (tickleCount > 6) {
          playPurrSound();
          tickleCount = 0;
          gsap.to(eyesGroup.scale, { y: 0.16, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
          gsap.to(group.rotation, { z: "+=0.18", duration: 0.08, yoyo: true, repeat: 2, ease: "power1.inOut" });
        }
      }
    };
    cv.addEventListener("pointermove", onCanvasHoverMove);

    cv.addEventListener("pointerdown", onBlobPointerDown);
    window.addEventListener("pointermove", onBlobPointerMove);
    window.addEventListener("pointerup", onBlobPointerUp);

    return () => {
      clearTimeout(blinkTimer);
      cv.removeEventListener("pointermove", onCanvasHoverMove);
      headingAnim?.kill();
      vpAnim?.kill();
      vpCleanups.forEach((fn) => fn());
      spinAnim.kill();
      talkObserver.disconnect();
      emailLink?.removeEventListener("pointerenter", onEmailEnter);
      emailLink?.removeEventListener("pointerleave", onEmailLeave);
      githubLink?.removeEventListener("pointerenter", onGithubEnter);
      cvLink?.removeEventListener("pointerenter", onCvEnter);
      cv.removeEventListener("pointerdown", onBlobPointerDown);
      window.removeEventListener("pointermove", onBlobPointerMove);
      window.removeEventListener("pointerup", onBlobPointerUp);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(tickerFn);
      renderer.dispose();
    };
  }, []);

  const handleEmailClick = (e: React.MouseEvent) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("steffistalin25@gmail.com");
      playPopChime();
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  const talkLetters = "let’s talk".split("");

  return (
    <section className="tk" id="talk">
      <canvas id="bl" ref={canvasRef} aria-hidden="true" title="Click to squash mascot blob!" />

      <div>
        <h2 className="px" id="lt" ref={headingRef}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {"let’s".split("").map((c, i) => (
              <span key={`w1-${i}`} className="tk-char" style={{ display: "inline-block" }}>
                {c}
              </span>
            ))}
          </span>
          {" "}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {"talk".split("").map((c, i) => (
              <span key={`w2-${i}`} className="tk-char" style={{ display: "inline-block" }}>
                {c}
              </span>
            ))}
          </span>
        </h2>

        <p>
          I’d love to hear about your project or opportunity. Send me a note and
          I’ll get back to you.
        </p>

        <p
          style={{
            marginTop: "22px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px 22px",
          }}
        >
          <a
            className="vp"
            href="mailto:steffistalin25@gmail.com"
            onClick={handleEmailClick}
            data-t="EMAIL ↗"
            title="Click to copy email address"
          >
            EMAIL <i>↗</i>
          </a>
          {copied && (
            <span className="cp-badge" role="status" aria-live="polite">
              Copied steffistalin25@gmail.com ✓
            </span>
          )}
          <a
            className="vp"
            href="https://www.linkedin.com/in/steffi-stalin-s-317721280"
            target="_blank"
            rel="noopener noreferrer"
            data-t="LINKEDIN ↗"
          >
            LINKEDIN <i>↗</i>
          </a>
          <a
            className="vp"
            href="https://github.com/SteffiStalin/desktop-tutorial"
            target="_blank"
            rel="noopener noreferrer"
            data-t="GITHUB ↗"
          >
            GITHUB <i>↗</i>
          </a>
          <a
            className="vp"
            href="https://steffistalin.github.io/portfolio-website/images/Steffi%20Stalin%20S%20Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-t="DOWNLOAD CV ↗"
          >
            DOWNLOAD CV <i>↗</i>
          </a>
        </p>
      </div>
    </section>
  );
}

