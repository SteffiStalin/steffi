"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { playPopChime, playSwitchSound } from "@/utils/sound";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CvModal({ isOpen, onClose }: CvModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      playPopChime();
      if (modalRef.current && cardRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          cardRef.current,
          { y: 40, scale: 0.94, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
        );
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    playSwitchSound();
    if (modalRef.current && cardRef.current) {
      gsap.to(cardRef.current, {
        y: 20,
        scale: 0.96,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="cv-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Steffi Stalin Resume Summary"
    >
      <div
        ref={cardRef}
        className="cv-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cv-header">
          <div className="cv-badge">CANDIDATE DOSSIER</div>
          <button className="cv-close" onClick={handleClose} aria-label="Close CV">
            ✕
          </button>
        </div>

        <div className="cv-profile">
          <div className="cv-avatar" />
          <div>
            <h3>Steffi Stalin</h3>
            <p>Front-End Web Developer · ECE Graduate</p>
          </div>
        </div>

        <div className="cv-section">
          <h4>EDUCATION & ACADEMICS</h4>
          <div className="cv-row">
            <span className="cv-year">2026 — Present</span>
            <div>
              <b>MBA (Master of Business Administration)</b>
              <p>Panimalar Engineering College · Currently Pursuing</p>
            </div>
          </div>
          <div className="cv-row">
            <span className="cv-year">2021 — 2025</span>
            <div>
              <b>B.E. Electronics & Communication Engineering</b>
              <p>St. Joseph’s College of Engineering · Anna University</p>
            </div>
          </div>
        </div>

        <div className="cv-section">
          <h4>CORE COMPETENCIES</h4>
          <div className="cv-tags">
            <span>Next.js</span>
            <span>React</span>
            <span>JavaScript (ES6+)</span>
            <span>GSAP</span>
            <span>Three.js</span>
            <span>CSS3 / Responsive</span>
            <span>Python</span>
            <span>SQL</span>
            <span>C</span>
            <span>Git & GitHub</span>
            <span>Arduino / IoT</span>
          </div>
        </div>

        <div className="cv-section">
          <h4>HIGHLIGHTS & JOURNEY</h4>
          <ul className="cv-list">
            <li>Completed final-year web development internship with production HTML/CSS/JS projects.</li>
            <li>Built 4 featured applications spanning web engineering, CNN deep learning, and hardware IoT.</li>
            <li>Passionate about high-craft UI motion, micro-interactions, and accessible web experiences.</li>
          </ul>
        </div>

        <div className="cv-actions">
          <a
            className="cv-btn primary"
            href="https://steffistalin.github.io/portfolio-website/images/Steffi%20Stalin%20S%20Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={playPopChime}
          >
            Download Official PDF ↗
          </a>
          <a
            className="cv-btn secondary"
            href="mailto:steffistalin25@gmail.com"
            onClick={handleClose}
          >
            Contact Steffi ✉
          </a>
        </div>
      </div>
    </div>
  );
}

