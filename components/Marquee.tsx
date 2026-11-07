"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Marquee() {
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  const phrase =
    "Front-end ✺ HTML ✺ CSS ✺ JavaScript ✺ Python ✺ SQL ✺ C ✺ Arduino ✺ Embedded ✺ IoT ✺ Git ✺ React ✺ GSAP ✺ Three.js ✺ ";
  const fullText = phrase.repeat(6);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const inner = marqueeInnerRef.current;
    if (!inner) return;

    // Linear continuous loop
    const mt = gsap.to(inner, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: "none",
    });

    // Velocity-reactive skew and timeScale acceleration
    const trigger = ScrollTrigger.create({
      onUpdate: (s) => {
        const v = s.getVelocity();
        gsap.to(".mq", {
          skewX: gsap.utils.clamp(-10, 10, v / -150),
          duration: 0.3,
          overwrite: true,
        });
        mt.timeScale(1 + Math.abs(v) / 400);
      },
    });

    // Show floating button on mobile after scrolling past marquee
    const isMobile = window.innerWidth <= 900;
    let flTrigger: ScrollTrigger | null = null;
    if (isMobile) {
      gsap.set(".fl", { autoAlpha: 0 });
      flTrigger = ScrollTrigger.create({
        trigger: ".mq",
        start: "top 90%",
        onEnter: () => {
          gsap.to(".fl", { autoAlpha: 1, duration: 0.4 });
        },
        onLeaveBack: () => {
          gsap.to(".fl", { autoAlpha: 0, duration: 0.3 });
        },
      });
    }

    return () => {
      mt.kill();
      trigger.kill();
      flTrigger?.kill();
    };
  }, []);

  return (
    <div className="mq" ref={marqueeContainerRef} aria-hidden="true">
      <div id="mi" ref={marqueeInnerRef}>
        {fullText}
      </div>
    </div>
  );
}

