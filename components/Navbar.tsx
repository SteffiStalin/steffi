"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  playSwitchSound,
  toggleSoundEnabled,
  isSoundEnabled,
} from "@/utils/sound";
import CvModal from "@/components/CvModal";

interface NavbarProps {
  onThemeChange?: (theme: "light" | "dark") => void;
}

export default function Navbar({ onThemeChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const currentActiveRef = useRef<HTMLAnchorElement | null>(null);

  const navLinks = [
    { href: "#top", label: "Home", id: "top" },
    { href: "#about", label: "About", id: "about" },
    { href: "#services", label: "Services", id: "services" },
    { href: "#work", label: "Portfolio", id: "work" },
    { href: "#talk", label: "Contact", id: "talk" },
  ];

  const drawerLinks = [
    { href: "#top", num: "01", label: "Home", arrow: "↗", id: "top" },
    { href: "#about", num: "02", label: "About", arrow: "↗", id: "about" },
    { href: "#skills", num: "03", label: "Skills", arrow: "↗", id: "skills" },
    { href: "#services", num: "04", label: "Services", arrow: "↗", id: "services" },
    { href: "#work", num: "05", label: "Portfolio", arrow: "↗", id: "work" },
    { href: "#talk", num: "06", label: "Contact", arrow: "↗", id: "talk" },
  ];

  // Theme toggle logic with View Transitions / clipPath ripple
  const toggleTheme = () => {
    const btn = themeBtnRef.current;
    const r0 = document.documentElement;
    const isDark =
      r0.getAttribute("data-theme") === "dark" ||
      (!r0.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const nextTheme = isDark ? "light" : "dark";

    function applyTheme() {
      r0.setAttribute("data-theme", nextTheme);
      playSwitchSound();
      if (typeof window !== "undefined" && (window as unknown as { __so?: () => void }).__so) {
        (window as unknown as { __so?: () => void }).__so?.();
      }
      onThemeChange?.(nextTheme);
    }

    if (btn) {
      gsap.to(btn, {
        rotation: "+=180",
        duration: 0.7,
        ease: "back.out(1.7)",
      });
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // View Transitions with circular ripple
    if (
      "startViewTransition" in document &&
      !reducedMotion &&
      btn
    ) {
      const bb = btn.getBoundingClientRect();
      const x = bb.left + bb.width / 2;
      const y = bb.top + bb.height / 2;
      const R = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vt = (document as any).startViewTransition(applyTheme);
      vt.ready
        .then(() => {
          r0.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${R}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 800,
              easing: "cubic-bezier(.65,0,.35,1)",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pseudoElement: "::view-transition-new(root)" as any,
            }
          );
        })
        .catch(() => {});
    } else {
      r0.classList.add("tt");
      applyTheme();
      setTimeout(() => {
        r0.classList.remove("tt");
      }, 700);
    }
  };

  useEffect(() => {
    const nav = navRef.current;
    const ind = indRef.current;
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>(".l a:not(.lg)"));
    const drawerAnchorList = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("#dr a[href^='#']")
    );

    function placeIndicator(a: HTMLAnchorElement | null) {
      if (!a || !ind || window.innerWidth <= 900) return;
      ind.style.width = a.offsetWidth + "px";
      ind.style.transform = `translateX(${a.offsetLeft}px)`;
      ind.style.opacity = "1";
      links.forEach((x) => x.classList.toggle("hit", x === a));
    }

    const initial = links.find((x) => x.classList.contains("on")) || links[0] || null;
    currentActiveRef.current = initial;
    placeIndicator(initial);

    links.forEach((a) => {
      a.addEventListener("pointerenter", () => placeIndicator(a));
      a.addEventListener("focus", () => placeIndicator(a));
    });

    const lContainer = nav.querySelector(".l");
    lContainer?.addEventListener("pointerleave", () =>
      placeIndicator(currentActiveRef.current)
    );

    function onResize() {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
      placeIndicator(currentActiveRef.current);
    }
    window.addEventListener("resize", onResize);

    // Active link highlighting on scroll
    function setActiveSection(rid: string) {
      const id = rid === "skills" ? "about" : rid === "contact" ? "talk" : rid;
      const activeLink = links.find(
        (x) => x.getAttribute("href") === "#" + id
      );

      if (activeLink) {
        links.forEach((x) => x.classList.toggle("on", x === activeLink));
        currentActiveRef.current = activeLink;
        placeIndicator(activeLink);
      }

      drawerAnchorList.forEach((x) => {
        x.classList.toggle(
          "on",
          x.getAttribute("href") === "#" + (rid === "contact" ? "talk" : rid)
        );
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    ["top", "about", "skills", "services", "work", "talk", "contact"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    );

    // Mobile scroll hide/reveal & shadow
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      nav?.classList.toggle("sc", y > 10);

      if (window.innerWidth <= 900 && y > lastY + 8 && y > 240 && !isMenuOpen) {
        nav!.style.translate = "0 -100%";
      } else if (y < lastY - 6 || y <= 240 || window.innerWidth > 900) {
        nav!.style.translate = "0 0";
      }
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [isMenuOpen]);

  // Handle escape key to close mobile drawer
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <nav ref={navRef}>
        <div className="l">
          <i className="ind" id="ind" ref={indRef} aria-hidden="true" />
          <a className="lg" href="#top" aria-label="Home">
            <svg
              viewBox="0 0 40 24"
              width="34"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 22a16 16 0 0 1 32 0" />
              <path d="M10 22a10 10 0 0 1 20 0" />
              <path d="M16 22a4 4 0 0 1 8 0" />
            </svg>
          </a>
          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              className={idx === 0 ? "on" : ""}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="r">
          <button
            className="cc"
            id="snd"
            onClick={() => {
              const next = toggleSoundEnabled();
              setIsAudioOn(next);
            }}
            aria-label={isAudioOn ? "Mute interface sound" : "Enable interface sound"}
            title={isAudioOn ? "Sound on" : "Sound muted"}
          >
            {isAudioOn ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
          <button
            className="cc"
            id="tb"
            ref={themeBtnRef}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            ◐
          </button>
          <button
            type="button"
            className="cc"
            onClick={() => setIsCvOpen(true)}
            aria-label="Preview Steffi's CV"
            title="Preview Steffi's CV Dossier"
          >
            CV
          </button>
          <span className="av" title="Steffi" />
          <a className="bt" href="#talk" aria-label="Contact">
            <svg
              className="ht"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "var(--red)", verticalAlign: "-1px" }}
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Contact
          </a>
          <button
            className="mb"
            id="mb"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="dr"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <i />
            <i />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`dbg ${isMenuOpen ? "open" : ""}`}
        id="dbg"
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`dr ${isMenuOpen ? "open" : ""}`} id="dr">
        {drawerLinks.map((link, idx) => (
          <a
            key={link.href}
            href={link.href}
            className={idx === 0 ? "on" : ""}
            style={{ "--i": idx } as React.CSSProperties}
            onClick={() => setIsMenuOpen(false)}
          >
            <b>{link.num}</b>
            <span>{link.label}</span>
            <i>{link.arrow}</i>
          </a>
        ))}
        <a
          href="#cv"
          style={{ "--i": 6 } as React.CSSProperties}
          onClick={(e) => {
            e.preventDefault();
            setIsMenuOpen(false);
            setIsCvOpen(true);
          }}
        >
          <b>CV</b>
          <span>Quick Preview CV</span>
          <i>↗</i>
        </a>
        <div className="dm">steffistalin25@gmail.com</div>
      </div>

      {/* Recruiter Fast-Track CV Modal */}
      <CvModal isOpen={isCvOpen} onClose={() => setIsCvOpen(false)} />
    </>
  );
}

