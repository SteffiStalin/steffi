"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Services() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hdAnim = gsap.from("#services .wt .hd", {
      rotation: -24,
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#services .wt .hd", start: "top 90%", once: true },
    });

    const pxAnim = gsap.from("#services .wt .px", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#services .wt", start: "top 85%", once: true },
    });

    const g3Anim = gsap.from("#services .g3 > .bx", {
      y: 40,
      scale: 0.92,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: { trigger: "#services .g3", start: "top 90%", once: true },
    });

    return () => {
      hdAnim.kill();
      pxAnim.kill();
      g3Anim.kill();
    };
  }, []);

  return (
    <section className="dt" id="services">
      <div className="in">
        <div className="wt" style={{ marginBottom: "34px" }}>
          <div className="hd">what I do</div>
          <h2 className="px">services</h2>
        </div>

        <div className="g3">
          <div className="bx" style={{ background: "var(--sky)" }}>
            <h4>Web Design</h4>
            <p>
              Clean, responsive, user-friendly interfaces built with HTML, CSS
              and JavaScript, designed to work seamlessly across devices and
              browsers.
            </p>
          </div>

          <div className="bx" style={{ background: "var(--gold)" }}>
            <h4>Front-End Web Development</h4>
            <p>
              The visual and interactive parts of websites: smooth, accessible
              experiences built with clean, efficient code.
            </p>
          </div>

          <div className="bx" style={{ background: "var(--pk)" }}>
            <h4>Mobile-Friendly Websites</h4>
            <p>
              A mobile-first approach so sites look great and run smoothly on
              phones, tablets and desktops alike.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

