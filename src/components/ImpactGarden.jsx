import React from "react";
import Asset from "./Asset";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// A living impact visual: as the user completes more opportunities, small
// hand-drawn sprouts and milestone stars appear around the earth.
// Everything here is driven by the real completed count — nothing is faked.
export default function ImpactGarden({ completed = 0, width = 240 }) {
  const reduced = useReducedMotion();
  const sproutCount = Math.min(6, completed);
  const milestones = [1, 5, 10, 25].filter((m) => completed >= m);
  const pop = (delay) =>
    reduced ? "none" : `popIn 0.5s ease-out both`;
  const style = (delay) => ({ animation: pop(delay), animationDelay: reduced ? undefined : `${delay}s` });

  const sproutSpots = [
    { left: "4%", bottom: "24%" },
    { left: "16%", bottom: "6%" },
    { left: "38%", bottom: "0%" },
    { right: "16%", bottom: "8%" },
    { right: "4%", bottom: "26%" },
    { left: "28%", bottom: "16%" },
  ];
  const starSpots = [
    { top: "4%", left: "24%" },
    { top: "0%", right: "22%" },
    { top: "22%", right: "2%" },
    { bottom: "30%", left: "0%" },
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ width, maxWidth: "85vw", aspectRatio: "1 / 1" }}>
      <Asset name="earth.png" alt="earth" width={width} className="relative z-10 max-w-[85vw]" />

      {sproutCount === 0 && milestones.length === 0 && (
        <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 font-hand text-lg text-foreground/55 whitespace-nowrap z-20">
          your impact grows here ✨
        </p>
      )}

      {Array.from({ length: sproutCount }).map((_, i) => (
        <div key={`sprout-${i}`} className="absolute z-20" style={{ ...sproutSpots[i], ...style(i * 0.08) }}>
          <Asset name="sprout.png" alt="" width={38} />
        </div>
      ))}

      {milestones.map((m, i) => (
        <div key={`star-${m}`} className="absolute z-20" style={{ ...starSpots[i], ...style(0.3 + i * 0.1) }}>
          <Asset name="star.png" alt="" width={30} />
        </div>
      ))}

      <Asset name="heart.png" alt="" width={30} className="absolute top-2 right-6 z-20" />
      <Asset name="sparkles.png" alt="" width={36} className="absolute bottom-4 left-4 z-20" />
    </div>
  );
}