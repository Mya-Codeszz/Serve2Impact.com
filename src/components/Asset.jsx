import React from "react";

// Renders a transparent PNG asset as a standalone floating element (no box/border).
export default function Asset({ name, alt = "", className = "", style, width }) {
  const src = `/assets/${name}`;
  return (
    <img
      src={src}
      alt={alt}
      className={`pointer-events-none select-none ${className}`}
      style={{ width: width, ...style }}
      draggable={false}
    />
  );
}