"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

let hasPreloaderGloballyRun = false;

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Prevent running multiple times across StrictMode mounts or re-renders
    if (hasPreloaderGloballyRun) {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      onCompleteRef.current?.();
      return;
    }
    hasPreloaderGloballyRun = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      onCompleteRef.current?.();
      return;
    }

    const hb = textRef.current;
    if (!hb) return;

    function typeText(str: string, duration: number) {
      const obj = { n: 0 };
      return gsap.to(obj, {
        n: str.length,
        duration,
        ease: "none",
        onUpdate: () => {
          if (hb) {
            hb.textContent = str.slice(0, Math.round(obj.n));
          }
        },
      });
    }

    let completeCalled = false;
    function fireComplete() {
      if (!completeCalled) {
        completeCalled = true;
        onCompleteRef.current?.();
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        fireComplete();
      },
    });

    tl.add(typeText("Hey there!", 0.75))
      .to({}, { duration: 0.35 })
      .add(typeText("Welcome", 0.55))
      .call(fireComplete, undefined, "+=0.2")
      .to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "expo.inOut",
        },
        "+=0.2"
      );

    return () => {
      // Do not kill tl abruptly if it's currently running in StrictMode
    };
  }, []); // Run strictly once on initial mount

  return (
    <div id="ld" ref={containerRef} aria-hidden="true">
      <div id="hb" ref={textRef} />
    </div>
  );
}
