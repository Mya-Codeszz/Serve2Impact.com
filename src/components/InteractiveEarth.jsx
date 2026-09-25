import React, { useRef, useState, useEffect } from "react";
import Asset from "./Asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The hand-drawn Earth as the hero centerpiece.
//
// Interaction: pointer drag (mouse or touch) tilts the globe on X/Y axes with
// subtle inertia after release — a playful, low-fi way to "turn" the hand-drawn
// earth and see it from different angles. It is intentionally NOT a geographic
// globe. Reduced-motion users get a static earth.
// A location marker + soft glow appear while a search is in progress, and the
// impact trail reveals on load and re-reveals on each search.
export default function InteractiveEarth({ searching = false, width = 400 }) {
  const wrapRef = useRef(null);
  const [rot, setRot] = useState({ x: -8, y: 18 });
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  const drag = useRef({ active: false, lastX: 0, lastY: 0, vx: 0, vy: 0, raf: 0 });

  useEffect(() => {
    if (reduced) { setRevealed(true); return; }
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (searching && !reduced) {
      setRevealed(false);
      const t = setTimeout(() => setRevealed(true), 60);
      return () => clearTimeout(t);
    }
  }, [searching, reduced]);

  // Inertia loop: continues spinning after release, decaying to a stop.
  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      const d = drag.current;
      if (!d.active && (Math.abs(d.vx) > 0.05 || Math.abs(d.vy) > 0.05)) {
        setRot((r) => ({
          x: Math.max(-45, Math.min(45, r.x + d.vy)),
          y: r.y + d.vx,
        }));
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.raf = requestAnimationFrame(tick);
      } else {
        d.raf = 0;
      }
    };
    return () => cancelAnimationFrame(drag.current.raf);
  }, [reduced]);

  const onPointerDown = (e) => {
    if (reduced) return;
    const d = drag.current;
    d.active = true;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.vx = 0;
    d.vy = 0;
    if (d.raf) cancelAnimationFrame(d.raf);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.vx = dx * 0.4;
    d.vy = dy * 0.3;
    setRot((r) => ({
      x: Math.max(-45, Math.min(45, r.x + dy * 0.3)),
      y: r.y + dx * 0.4,
    }));
  };

  const onPointerUp = () => {
    const d = drag.current;
    d.active = false;
    if (reduced) return;
    if (!d.raf && (Math.abs(d.vx) > 0.05 || Math.abs(d.vy) > 0.05)) {
      d.raf = requestAnimationFrame(() => {
        const tick = () => {
          if (!d.active && (Math.abs(d.vx) > 0.05 || Math.abs(d.vy) > 0.05)) {
            setRot((r) => ({
              x: Math.max(-45, Math.min(45, r.x + d.vy)),
              y: r.y + d.vx,
            }));
            d.vx *= 0.94;
            d.vy *= 0.94;
            d.raf = requestAnimationFrame(tick);
          } else {
            d.raf = 0;
          }
        };
        tick();
      });
    }
  };

  const trailW = Math.round(width * 1.7);
  const cursor = reduced ? "default" : "grab";

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center select-none"
      style={{ width, maxWidth: "85vw", aspectRatio: "1 / 1", touchAction: "none", cursor }}
    >
      {/* Impact trail */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ mixBlendMode: "screen" }}
        aria-hidden
      >
        <div
          style={{
            width: trailW,
            maxWidth: "92vw",
            opacity: revealed ? 0.92 : 0,
            clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transition: reduced ? "none" : "clip-path 1.5s ease-out, opacity 0.6s ease-out",
          }}
        >
          <Asset name="impact_trail.png" alt="" className="w-full h-auto" />
        </div>
      </div>

      {/* Draggable Earth */}
      <div
        className="relative z-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: drag.current.active ? "none" : reduced ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          touchAction: "none",
        }}
      >
        <Asset name="new_earth.png" alt="Drag to turn the earth" width={width} className="max-w-[78vw]" />
      </div>

      {searching && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            className="absolute"
            style={{ top: "10%", right: "14%", animation: reduced ? "none" : "popIn 0.5s ease-out both" }}
          >
            <Asset name="location_marker.png" alt="" width={44} />
          </div>
          <div
            className="absolute rounded-full"
            style={{
              width: "72%", height: "72%",
              background: "radial-gradient(circle, rgba(116,187,212,0.32) 0%, transparent 68%)",
              animation: reduced ? "none" : "softPulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {!reduced && (
        <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-hand text-base text-foreground/45 z-20 whitespace-nowrap pointer-events-none">
          drag to turn ✦
        </p>
      )}
    </div>
  );
}