"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Story() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const paragraphs = containerRef.current?.querySelectorAll<HTMLParagraphElement>(".sc p");
    const triggers: ScrollTrigger[] = [];

    paragraphs?.forEach((p) => {
      const st = ScrollTrigger.create({
        trigger: p,
        start: "top 78%",
        end: "bottom 22%",
        toggleClass: { targets: p, className: "on" },
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="sty" id="story" ref={containerRef}>
      <div className="sc">
        <p className="s1">
          Hey there, thanks for stopping by. I’m Steffi, a front-end web developer who loves turning complex problems into simple, clean interfaces.
        </p>
        <p className="s2">
          I’m drawn to work where code meets design: responsive layouts, smooth motion, and small details people feel without noticing. I’m always learning, always building.
        </p>
        <p className="s3">
          If that sounds like what your team needs,{" "}
          <a className="sl" href="mailto:steffistalin25@gmail.com">
            say hi
          </a>
          . Maybe we’ll build something together, or just talk about{" "}
          <span className="sq2">
            how the web keeps changing
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 8c10-8 14 6 24-2s14 6 24-2 14 6 24-2 14 6 24-2 14 6 24-2 14 6 26-2" />
            </svg>
          </span>
          .
        </p>
      </div>

      <div className="pol2" aria-hidden="true" title="Steffi">
        <i style={{ backgroundImage: "url('/pikachu.jpeg')" }} />
      </div>
    </section>
  );
}

