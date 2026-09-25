import React from "react";
import { Link } from "react-router-dom";
import { CAUSE_EMOJI, CAUSE_COLORS, fmtDate } from "@/lib/s2i-data";

// A photo-free product mockup: a browser window pointed at serve2impact.com/opportunities
// rendering real opportunity rows with category colors, org initials, and UI indicators.
export default function BrowserMockup({ opportunities = [] }) {
  const rows = opportunities.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Find something meaningful</h2>
        <p className="text-foreground/70 mt-1">Browse real opportunities near you — no sign-up needed to look.</p>
      </div>

      <div className="rounded-2xl border border-border shadow-md overflow-hidden bg-card">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 h-10 bg-secondary/70 border-b border-border">
          <span className="w-3 h-3 rounded-full bg-destructive/60" />
          <span className="w-3 h-3 rounded-full bg-highlight/70" />
          <span className="w-3 h-3 rounded-full bg-accent/60" />
          <div className="ml-3 flex-1 max-w-sm h-6 rounded-md bg-card border border-border flex items-center px-2 text-xs text-foreground/60 truncate">
            serve2impact.com/opportunities
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60">
          {rows.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary animate-pulse shrink-0" />
                  <div className="w-9 h-9 rounded-full bg-secondary animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-secondary animate-pulse rounded" />
                    <div className="h-2.5 w-1/3 bg-secondary/70 animate-pulse rounded" />
                  </div>
                </div>
              ))
            : rows.map((o) => {
                const c = CAUSE_COLORS[o.cause] || CAUSE_COLORS.Community;
                return (
                  <div key={o.id} className="flex items-center gap-3 p-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: c.bg }}
                      aria-hidden
                    >
                      {CAUSE_EMOJI[o.cause]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">{o.title}</p>
                      <p className="text-xs text-foreground/60 truncate">{o.organization} · {o.location}</p>
                    </div>
                    <span className="hidden sm:inline text-xs text-foreground/60 shrink-0">{fmtDate(o.date)}</span>
                    <span
                      className="hidden md:inline text-xs font-semibold px-2 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: c.bg, color: c.text }}
                    >
                      {o.cause}
                    </span>
                  </div>
                );
              })}
        </div>

        <div className="p-3 bg-secondary/30 border-t border-border/60">
          <Link to="/browse" className="text-sm font-semibold text-accent hover:underline">
            Browse all opportunities →
          </Link>
        </div>
      </div>
    </div>
  );
}