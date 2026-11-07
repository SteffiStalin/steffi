"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playThockSound } from "@/utils/sound";

export default function Works() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const snRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [cardModes, setCardModes] = useState<Record<string, "visual" | "arch">>({});

  const projects = [
    {
      num: "01",
      tag: "Web · Portfolio",
      title: "Personal Portfolio",
      desc: "A responsive personal site that brings my projects, skills and resume together in one clean, visual place.",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://steffistalin.github.io/portfolio-website/",
      isWide: false,
      colors: {
        c: "#5b63ee",
        cb: "#3b3fd4",
        ct: "#0f1355",
        tb: "#2f9d5e",
        tt: "#fff",
      },
      svg: (
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="600" height="600" fill="#1f5fae" />
          <path
            d="M600 0v200C470 120 300 80 130 120S-60 300 0 600H-10V0z"
            fill="#6fa83e"
          />
          <g fill="none" stroke="#fff" strokeWidth="6">
            <path d="M-10 540C100 260 380 120 610 190">
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="M-10 540C100 260 380 120 610 190; M-10 520C120 300 360 100 610 210; M-10 540C100 260 380 120 610 190"
              />
            </path>
            <path d="M-10 640C140 360 420 230 610 290" />
            <path d="M0 740C200 480 440 340 610 400" />
          </g>
          <circle cx="360" cy="480" r="42" fill="#7a4a2e" />
          <rect x="270" y="500" width="190" height="60" rx="26" fill="#333" />
          <circle cx="320" cy="530" r="8" fill="#3ecf8e" />
          <circle cx="350" cy="530" r="8" fill="#e3b34c" />
          <circle cx="380" cy="530" r="8" fill="#d9304f" />
        </svg>
      ),
    },
    {
      num: "02",
      tag: "Web app · Productivity",
      title: "To Do List App",
      desc: "A lightweight task manager: add, edit, complete and delete tasks and see what’s left to do, all on one clear screen.",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/SteffiStalin/desktop-tutorial",
      isWide: true,
      colors: {
        c: "#2fa35f",
        cb: "#1e7a44",
        ct: "#07301b",
        tb: "#5b63ee",
        tt: "#fff",
      },
      svg: (
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="600" height="600" fill="#26352f" />
          <rect x="0" y="0" width="150" height="600" fill="#b5694a" />
          <rect x="40" y="90" width="90" height="300" fill="#3a5c64" />
          <circle cx="400" cy="320" r="150" fill="#d7a98b" />
          <path
            d="M250 290C260 130 520 120 550 280 470 200 330 190 250 290z"
            fill="#1c1410"
          />
          <rect x="300" y="470" width="300" height="150" fill="#6a5238" />
          <g transform="translate(260, 140)">
            <rect width="280" height="52" rx="10" fill="#18231f" stroke="#3ecf8e" strokeWidth="2" />
            <circle cx="30" cy="26" r="12" fill="#3ecf8e" />
            <path d="M24 26l4 4 8-8" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="56" y="22" width="140" height="8" rx="4" fill="#fff" />
          </g>
          <g transform="translate(260, 210)">
            <rect width="280" height="52" rx="10" fill="#18231f" stroke="#e3b34c" strokeWidth="2" />
            <circle cx="30" cy="26" r="12" fill="none" stroke="#e3b34c" strokeWidth="3" />
            <rect x="56" y="22" width="170" height="8" rx="4" fill="#fff" opacity="0.8" />
          </g>
          <g transform="translate(260, 280)">
            <rect width="280" height="52" rx="10" fill="#18231f" stroke="#666" strokeWidth="1.5" />
            <circle cx="30" cy="26" r="12" fill="none" stroke="#666" strokeWidth="2" />
            <rect x="56" y="22" width="110" height="8" rx="4" fill="#888" />
          </g>
        </svg>
      ),
    },
    {
      num: "03",
      tag: "Hardware · Arduino",
      title: "Traffic Light Control",
      desc: "A 3-way junction traffic light controller built on Arduino, switching signals in sequence to keep crossing traffic moving safely.",
      tech: ["Arduino", "C", "Electronics"],
      link: "#talk",
      isWide: true,
      colors: {
        c: "#f2e58a",
        cb: "#d8c75a",
        ct: "#3a3300",
        tb: "#ee6a5c",
        tt: "#fff",
      },
      svg: (
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="600" height="600" fill="#e8d05a" />
          <g stroke="#cdb23a" strokeWidth="2">
            {[...Array(14).keys()].map((i) => (
              <line key={i} x1="0" y1={i * 45} x2="600" y2={i * 45} />
            ))}
          </g>
          <rect x="180" y="70" width="240" height="460" rx="40" fill="#1f1f1f" stroke="#111" strokeWidth="6" />
          <circle cx="300" cy="160" r="48" fill="#d9304f" filter="drop-shadow(0 0 16px #d9304f)">
            <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="1; 0.3; 0.3; 1" />
          </circle>
          <circle cx="300" cy="300" r="48" fill="#e3b34c" opacity="0.3">
            <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.3; 1; 0.3; 0.3" />
          </circle>
          <circle cx="300" cy="440" r="48" fill="#3ecf8e" opacity="0.3">
            <animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0.3; 0.3; 1; 0.3" />
          </circle>
        </svg>
      ),
    },
    {
      num: "04",
      tag: "Deep learning · CNN",
      title: "Cancer Detection",
      desc: "A deep-learning model that uses a convolutional neural network (CNN) to detect cancer.",
      tech: ["Python", "CNN", "Deep learning"],
      link: "#talk",
      isWide: false,
      colors: {
        c: "#ee6a5c",
        cb: "#d44a3d",
        ct: "#4a0f0a",
        tb: "#f2e58a",
        tt: "#3a3300",
      },
      svg: (
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="p4g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffcf6b" />
              <stop offset="1" stopColor="#d9304f" />
            </linearGradient>
            <linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#66c1ea" stopOpacity="0" />
              <stop offset="0.5" stopColor="#66c1ea" stopOpacity="0.75" />
              <stop offset="1" stopColor="#66c1ea" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="600" height="600" fill="#2a1015" />
          <circle cx="300" cy="300" r="210" fill="url(#p4g)" opacity="0.22" />
          <circle cx="300" cy="300" r="140" fill="url(#p4g)" opacity="0.45" />
          <circle cx="300" cy="300" r="80" fill="url(#p4g)" />
          {/* Animated Scanner Ray */}
          <rect x="70" y="70" width="460" height="18" fill="url(#scanG)">
            <animate
              attributeName="y"
              dur="3.2s"
              repeatCount="indefinite"
              values="70; 510; 70"
              keyTimes="0; 0.5; 1"
            />
          </rect>
          {/* Targeting Bounding Box */}
          <rect
            x="210"
            y="210"
            width="180"
            height="180"
            fill="none"
            stroke="#66c1ea"
            strokeWidth="3"
            strokeDasharray="14 10"
          >
            <animate
              attributeName="stroke-dashoffset"
              dur="4s"
              repeatCount="indefinite"
              values="0; 48"
            />
          </rect>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Heading letters animation
    const chars = headingRef.current?.querySelectorAll(".ch");
    let headingAnim: gsap.core.Tween | null = null;
    if (chars && chars.length > 0 && !isReduced) {
      headingAnim = gsap.from(chars, {
        y: 40,
        opacity: 0,
        rotationZ: (i) => (i % 2 === 0 ? 6 : -6),
        stagger: 0.03,
        duration: 0.6,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      });
    }

    // Character hover physics on "featured works"
    const charCleanups: Array<() => void> = [];
    if (chars && !isReduced) {
      chars.forEach((c) => {
        const onEnter = () => {
          gsap.to(c, {
            y: -18,
            rotation: gsap.utils.random(-10, 10),
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        c.addEventListener("pointerenter", onEnter);
        charCleanups.push(() => c.removeEventListener("pointerenter", onEnter));
      });
    }

    // Subtitle swinging signboard animation from v5
    let snAnim: gsap.core.Tween | null = null;
    let snIdleAnim: gsap.core.Tween | null = null;
    if (snRef.current && !isReduced) {
      gsap.set(snRef.current, { transformOrigin: "50% 0%" });
      snAnim = gsap.from(snRef.current, {
        y: -80,
        rotation: -20,
        scale: 0.7,
        opacity: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.45)",
        scrollTrigger: {
          trigger: snRef.current,
          start: "top 92%",
          once: true,
        },
        onComplete: () => {
          if (snRef.current) {
            snIdleAnim = gsap.to(snRef.current, {
              rotation: "+=2.2",
              duration: 2.6,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            });
          }
        },
      });
    }

    // Batch entrance for cards (.pc) with immediate clearProps for smooth scrolling
    const cardElements = document.querySelectorAll<HTMLElement>(".pc");
    if (!isReduced && cardElements.length > 0) {
      gsap.set(cardElements, { y: 24, opacity: 0 });
      ScrollTrigger.batch(cardElements, {
        start: "top 95%",
        once: true,
        onEnter: (elements) => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "transform,opacity",
          });
        },
      });
    }

    // 3D tilt micro-interaction (pointer-driven, spring settle, desktop only)
    const cardCleanups: Array<() => void> = [];
    const isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.innerWidth <= 900;

    if (!isTouch && !isReduced && cardElements.length > 0) {
      cardElements.forEach((card) => {
        const onEnter = () => {
          playThockSound();
        };
        const onMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotationY: x * 6,
            rotationX: -y * 6,
            transformPerspective: 1000,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          const im = card.querySelector<HTMLElement>(".im");
          if (im) {
            gsap.to(im, {
              z: 28,
              transformPerspective: 1000,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };
        const onLeave = () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.65,
            ease: "elastic.out(1, 0.45)",
            overwrite: "auto",
          });
          const im = card.querySelector<HTMLElement>(".im");
          if (im) {
            gsap.to(im, {
              z: 0,
              duration: 0.65,
              ease: "elastic.out(1, 0.45)",
              overwrite: "auto",
            });
          }
        };
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cardCleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    return () => {
      headingAnim?.kill();
      snAnim?.kill();
      snIdleAnim?.kill();
      charCleanups.forEach((fn) => fn());
      cardCleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === headingRef.current || st.vars.trigger === snRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section className="wk" id="work">
      <div className="wt">
        <span className="ic spin dec" aria-hidden="true">
          ❋
        </span>
        <span className="ic spin dec dec2" aria-hidden="true">
          ✺
        </span>
        <div className="hd">my work</div>
        <h2 className="px" ref={headingRef}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {"featured".split("").map((c, i) => (
              <span key={i} className="ch" style={{ display: "inline-block" }}>
                {c}
              </span>
            ))}
          </span>
          <br />
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {"works".split("").map((c, i) => (
              <span key={i} className="ch" style={{ display: "inline-block" }}>
                {c}
              </span>
            ))}
          </span>
        </h2>
        <div className="sn" ref={snRef}>
          A few things I’ve built along the way, from hardware to the web.
        </div>
      </div>

      <div id="cards" ref={cardsContainerRef}>
        {projects.map((p) => {
          const isExternal = p.link.startsWith("http");
          return (
            <a
              key={p.num}
              className={`pc${p.isWide ? " w" : ""}`}
              href={p.link}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={`${p.title}, ${isExternal ? "view project" : "ask me about this project"}`}
              style={
                {
                  "--c": p.colors.c,
                  "--cb": p.colors.cb,
                  "--ct": p.colors.ct,
                  "--tb": p.colors.tb,
                  "--tt": p.colors.tt,
                } as React.CSSProperties
              }
            >
              <span className="tab" aria-hidden="true">
                {isExternal ? "View project" : "Ask me"} ↗
              </span>
              <div className="in">
                <div className="tx2">
                  <div className="pls">
                    <span className="a">Project {p.num}</span>
                    <span className="b">{p.tag}</span>
                    <i className="go" aria-hidden="true">
                      ↗
                    </i>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <ul className="tg">
                    {p.tech.map((t, ti) => (
                      <li key={ti}>{t}</li>
                    ))}
                  </ul>

                  {/* Visual vs Architecture Mode Toggle */}
                  <div
                    className="card-mode-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <button
                      type="button"
                      className={`mode-btn ${cardModes[p.num] !== "arch" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCardModes((prev) => ({ ...prev, [p.num]: "visual" }));
                      }}
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${cardModes[p.num] === "arch" ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCardModes((prev) => ({ ...prev, [p.num]: "arch" }));
                      }}
                    >
                      Architecture
                    </button>
                  </div>
                </div>

                <div className="pm" aria-hidden="true">
                  {cardModes[p.num] === "arch" ? (
                    <div className="arch-card-view">
                      <div className="arch-top-badge">ENGINEERING SPEC</div>
                      <div className="arch-stat-row">
                        <span>FPS TARGET</span>
                        <b>60 FPS</b>
                      </div>
                      <div className="arch-stat-row">
                        <span>LAYOUT SHIFT</span>
                        <b>0 CLS</b>
                      </div>
                      <div className="arch-stat-row">
                        <span>STACK</span>
                        <b>{p.tech.join(" · ")}</b>
                      </div>
                      <div className="arch-stat-row">
                        <span>VIEWPORT</span>
                        <b>Fluid Responsive</b>
                      </div>
                    </div>
                  ) : (
                    p.svg
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
