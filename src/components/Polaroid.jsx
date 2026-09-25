import React from "react";

// A small scrapbook Polaroid frame. Content is decorative (hand-drawn assets),
// never stock photography. Kept deliberately as exactly-one-card.
export default function Polaroid({ rotate = "rotate(-3deg)", children, caption }) {
  return (
    <div
      className="bg-card p-2.5 pb-3 shadow-md border border-border/40 rounded-[2px] shrink-0 w-[150px]"
      style={{ transform: rotate }}
    >
      <div className="w-full aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden rounded-[2px]">
        {children}
      </div>
      {caption && (
        <p className="font-hand text-center text-foreground/70 mt-2 text-lg leading-none">{caption}</p>
      )}
    </div>
  );
}