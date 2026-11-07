"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const flBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Striped background scrub
    const spAnim = gsap.fromTo(
      "#sp",
      { xPercent: -8 },
      {
        xPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".ft",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      }
    );

    // Comment box slide-in
    const cmtAnim = gsap.from(".cmt", {
      x: -200,
      rotation: -8,
      scrollTrigger: { trigger: ".ft", start: "top 70%" },
      duration: 0.9,
      ease: "power3.out",
    });

    // Big contact button bounce
    const cbigAnim = gsap.from(".cbig", {
      scale: 0,
      rotation: -15,
      scrollTrigger: { trigger: ".ft", start: "top 50%" },
      duration: 0.9,
      ease: "elastic.out(1, .5)",
    });

    // Magnetic interaction for .fl button
    const flBtn = flBtnRef.current;
    let flMove: ((e: PointerEvent) => void) | null = null;
    let flLeave: (() => void) | null = null;

    if (flBtn) {
      flMove = (e: PointerEvent) => {
        const b = flBtn.getBoundingClientRect();
        gsap.to(flBtn, {
          x: (e.clientX - b.left - b.width / 2) * 0.3,
          y: (e.clientY - b.top - b.height / 2) * 0.3,
          duration: 0.3,
        });
      };
      flLeave = () => {
        gsap.to(flBtn, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, .4)",
        });
      };
      flBtn.addEventListener("pointermove", flMove);
      flBtn.addEventListener("pointerleave", flLeave);
    }

    return () => {
      spAnim.kill();
      cmtAnim.kill();
      cbigAnim.kill();
      if (flBtn && flMove && flLeave) {
        flBtn.removeEventListener("pointermove", flMove);
        flBtn.removeEventListener("pointerleave", flLeave);
      }
    };
  }, []);

  return (
    <>
      <footer className="ft" id="contact" ref={footerRef}>
        <div className="sp" id="sp" aria-hidden="true" />

        <div className="cmt">
          <h4>Comment</h4>
          <div className="r">
            <span className="av" />
            <div>
              <b>Steffi</b>
              Open to front-end opportunities and conversations about building
              clean, responsive websites.
              <br />
              <span className="z">
                <svg
                  width="11"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ verticalAlign: "-1px", marginRight: "3px" }}
                  aria-hidden="true"
                >
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                </svg>
                1
              </span>
            </div>
          </div>
        </div>

        <a className="cbig" href="mailto:steffistalin25@gmail.com">
          <u>»</u>
          <span className="px">contact</span>
          <u>»</u>
        </a>
      </footer>

      {/* Floating Action Button */}
      <a className="fl" id="fl" ref={flBtnRef} href="#contact">
        Hire me
      </a>
    </>
  );
}

