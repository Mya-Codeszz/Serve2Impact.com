import React from "react";
import { Search, ChevronRight, ChevronDown, Check } from "lucide-react";
import { CAUSE_EMOJI, CAUSE_COLORS } from "@/lib/s2i-data";

// Real Serve2Impact interface states — Browse → Understand → Take action.
// No numbered circles, no generic verbs; actual UI states connected by chevrons.
const SAMPLE = [
  { id: "s1", title: "Saturday Meal Pack", organization: "Riverside Food Bank", location: "Downtown", cause: "Food Access", date: "Sat, Oct 3", start_time: "9:00 AM", duration: "3h", impact: "≈ 40 meals packed" },
  { id: "s2", title: "Creek Cleanup Crew", organization: "Friends of the River", location: "Eastside Park", cause: "Environment", date: "Sun, Oct 5", start_time: "10:00 AM", duration: "2h", impact: "≈ 12 bags removed" },
];

const FILTERS = ["Food Access", "Environment", "Education", "Community"];

function Connector() {
  return (
    <div className="flex items-center justify-center text-accent/50 shrink-0 py-1" aria-hidden>
      <ChevronDown className="w-5 h-5 lg:hidden" />
      <ChevronRight className="w-5 h-5 hidden lg:block" />
    </div>
  );
}

function BrowsePanel() {
  return (
    <div className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden w-full">
      <div className="flex items-center gap-1.5 px-3 h-8 bg-secondary/60 border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-highlight/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
        <span className="ml-2 text-[10px] text-foreground/50 truncate">serve2impact.com/browse</span>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2 h-9 rounded-lg border border-border bg-background px-2.5">
          <Search className="w-3.5 h-3.5 text-foreground/40" />
          <span className="text-xs text-foreground/40">Search by city, cause, or keyword…</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f, i) => (
            <span
              key={f}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${i === 0 ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground/70"}`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="divide-y divide-border/50">
          {SAMPLE.map((o) => {
            const c = CAUSE_COLORS[o.cause];
            return (
              <div key={o.id} className="flex items-center gap-2.5 py-2.5 first:pt-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: c.bg }} aria-hidden>
                  {CAUSE_EMOJI[o.cause]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-xs truncate">{o.title}</p>
                  <p className="text-[10px] text-foreground/60 truncate">{o.organization} · {o.location}</p>
                </div>
                <span className="text-[10px] text-foreground/50 shrink-0 hidden sm:inline">{o.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UnderstandPanel() {
  const o = SAMPLE[0];
  const c = CAUSE_COLORS[o.cause];
  return (
    <div className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden w-full">
      <div className="px-3 py-3" style={{ backgroundColor: c.bg }}>
        <div className="flex items-center">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-card/80" style={{ color: c.text }}>
            {CAUSE_EMOJI[o.cause]} {o.cause}
          </span>
        </div>
      </div>
      <div className="p-3.5 space-y-2.5">
        <p className="text-[11px] font-semibold text-accent">{o.organization}</p>
        <h3 className="font-bold text-primary text-sm leading-snug">{o.title}</h3>
        <div className="space-y-1.5 text-[11px] text-foreground/70">
          <p><span className="font-semibold text-foreground/80">What you'll do: </span>Sort, pack, and box produce for families in need.</p>
          <p><span className="font-semibold text-foreground/80">When: </span>{o.date} · {o.start_time} ({o.duration})</p>
          <p><span className="font-semibold text-foreground/80">Good for: </span>Team-friendly · No experience needed</p>
        </div>
        <button type="button" className="btn-grass w-full h-9 rounded-full text-xs font-semibold inline-flex items-center justify-center">
          View opportunity
        </button>
      </div>
    </div>
  );
}

function ActionPanel() {
  const o = SAMPLE[0];
  return (
    <div className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden w-full">
      <div className="p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-accent" aria-hidden>
            <Check className="w-4 h-4" />
          </span>
          <p className="font-hand text-xl text-accent leading-none">Saved to your opportunities</p>
        </div>
        <div className="space-y-1.5 text-[11px] text-foreground/75 pt-2 border-t border-border/60">
          <p>🗓️ {o.date} · {o.start_time}</p>
          <p>📍 {o.location}</p>
          <p>⏳ {o.duration} commitment</p>
        </div>
        <div className="pt-2 border-t border-dashed border-border/70">
          <p className="text-[11px] text-foreground/60">Added to your impact record</p>
          <p className="font-hand text-base text-accent leading-tight">{o.impact}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProductFlow() {
  const stages = [
    { label: "Browse", Panel: BrowsePanel },
    { label: "Understand", Panel: UnderstandPanel },
    { label: "Take action", Panel: ActionPanel },
  ];

  return (
    <section className="bg-secondary/70 border-y border-border/60 py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">From browsing to showing up</h2>
          <p className="text-foreground/70 mt-1">Three real steps in the Serve2Impact app — no sign-up wall to look around.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-2 items-stretch">
          {stages.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex-1 flex flex-col">
                <p className="text-xs font-semibold text-accent mb-2 px-1">{s.label}</p>
                <s.Panel />
              </div>
              {i < stages.length - 1 && <Connector />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}