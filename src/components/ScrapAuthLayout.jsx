import React from "react";
import Asset from "./Asset";

// Scrapbook-styled wrapper for auth pages. Keeps the same {title, subtitle, footer, children} contract.
export default function ScrapAuthLayout({ title, subtitle, footer, children, note = "welcome_back.png", noteWidth = 160 }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Asset name="earth.png" alt="" width={64} className="mx-auto mb-3" />
          {note && <Asset name={note} alt={title} width={noteWidth} className="mx-auto mb-2 rotate-neg-3" />}
          <h1 className="font-hand text-3xl text-primary">{title}</h1>
          {subtitle && <p className="text-foreground/70 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="paper rounded-2xl border border-border shadow-sm p-7">
          {children}
        </div>
        {footer && <p className="text-center text-sm text-foreground/70 mt-5">{footer}</p>}
      </div>
    </div>
  );
}