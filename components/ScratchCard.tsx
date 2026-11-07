"use client";

import { useEffect, useRef, useState } from "react";
import { playPopChime, playTickSound } from "@/utils/sound";

interface ScratchCardProps {
  onComplete?: () => void;
}

export default function ScratchCard({ onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchedPixelsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = rect.width;
    const H = rect.height;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Render metallic holographic foil pattern
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#d8d8d8");
    grad.addColorStop(0.25, "#f5f5f5");
    grad.addColorStop(0.5, "#dcdcdc");
    grad.addColorStop(0.75, "#eaeaea");
    grad.addColorStop(1, "#c0c0c0");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Shimmer text
    ctx.fillStyle = "#555555";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH ME ✦", W / 2, H / 2);

    const scratch = (clientX: number, clientY: number) => {
      const cr = canvas.getBoundingClientRect();
      const x = clientX - cr.left;
      const y = clientY - cr.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixelsRef.current += 1;
      if (scratchedPixelsRef.current % 8 === 0) {
        playTickSound();
      }

      if (scratchedPixelsRef.current > 38 && !isScratched) {
        setIsScratched(true);
        playPopChime();
        onComplete?.();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDrawingRef.current = true;
      scratch(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      scratch(e.clientX, e.clientY);
    };

    const onPointerUp = () => {
      isDrawingRef.current = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isScratched, onComplete]);

  if (isScratched) return null;

  return (
    <canvas
      ref={canvasRef}
      className="scratch-canvas"
      title="Scratch with cursor to reveal secret desk art!"
    />
  );
}

