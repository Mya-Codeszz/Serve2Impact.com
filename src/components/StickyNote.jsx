import React from "react";
import Asset from "./Asset";

// A sticky note PNG with real HTML text overlaid in the handwritten font.
export default function StickyNote({ color = "yellow", children, className = "", style, rotate = -4, width = 170 }) {
  const note = `${color}_sticky_note.png`;
  return (
    <div className={`relative ${className}`} style={{ width, transform: `rotate(${rotate}deg)`, ...style }}>
      <Asset name={note} className="w-full h-auto" alt="" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-3 pt-2">
        <div className="font-hand text-foreground leading-tight text-[1.35rem]">{children}</div>
      </div>
    </div>
  );
}