import React from "react";
import Asset from "./Asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// A small, satisfying celebration when a volunteer shows up.
// A few hand-drawn elements pop in subtly — no confetti, no childishness.
export default function CompletionMoment({ hours = 3, impactText }) {
  const reduced = useReducedMotion();
  const pop = (delay) =>
    reduced
      ? "none"
      : `popIn 0.6s cubic-bezier(0.22,1,0.36,1) both`;
  const style = (delay) => ({ animation: pop(delay), animationDelay: reduced ? undefined : `${delay}s` });

  return (
    <div className="relative text-center py-4">
      <div className="absolute left-[18%] top-0" style={style(0.1)} aria-hidden>
        <Asset name="burst.png" alt="" width={46} />
      </div>
      <div className="absolute right-[18%] top-2" style={style(0.25)} aria-hidden>
        <Asset name="sparkles.png" alt="" width={50} />
      </div>
      <div className="absolute left-[22%] bottom-0" style={style(0.4)} aria-hidden>
        <Asset name="star.png" alt="" width={34} />
      </div>
      <div className="absolute right-[22%] bottom-1" style={style(0.5)} aria-hidden>
        <Asset name="heart.png" alt="" width={32} />
      </div>

      <div style={style(0.15)}>
        <h1 className="font-hand text-5xl md:text-6xl text-primary leading-none">YOU SHOWED UP.</h1>
      </div>
      <div className="mt-4" style={style(0.6)}>
        <p className="text-2xl font-extrabold text-accent">+{hours} hours</p>
        {impactText && <p className="font-hand text-xl text-foreground/70 mt-1">{impactText}</p>}
      </div>
    </div>
  );
}