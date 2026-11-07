"use client";

import { useState, useCallback, useEffect } from "react";
import Preloader from "@/components/Preloader";
import ProgressBar from "@/components/ProgressBar";
import CursorAndSpot from "@/components/CursorAndSpot";
import InkTrail from "@/components/InkTrail";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Playground from "@/components/Playground";
import About from "@/components/About";
import Story from "@/components/Story";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Works from "@/components/Works";
import Talk from "@/components/Talk";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoaded = useCallback(() => setIsLoaded(true), []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "%c✦ STEFFI STALIN — FRONT-END WEB DEVELOPER ✦%c\n\nCrafting responsive, animated, and tactile web experiences.\nTech: Next.js · React · GSAP · Three.js · TypeScript · Lenis\n\nSay hello: steffistalin25@gmail.com",
        "background: #111111; color: #66c1ea; font-family: monospace; font-size: 13px; font-weight: bold; padding: 10px 16px; border-radius: 6px; border: 2px solid #66c1ea;",
        "color: #888888; font-family: sans-serif; font-size: 12px; line-height: 1.6;"
      );
    }
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Preloader onComplete={handleLoaded} />
      <ProgressBar />
      <CursorAndSpot />
      <InkTrail />
      <SmoothScroll />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero isLoaded={isLoaded} />
        <Marquee />
        <Playground />
        <About />
        <Story />
        <Skills />
        <Services />
        <Works />
        <Talk />
      </main>
      <Footer />
    </>
  );
}
