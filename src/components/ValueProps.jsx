import React from "react";

// Explainer callouts + a real impact-record panel.
// No grid of identical icon-on-top cards; flat typography with hairline dividers,
// and one elevated panel whose inner structure uses spacing + dividers (no nested cards).
const CALLOUTS = [
  {
    kicker: "Search & filter",
    title: "Find opportunities that fit",
    desc: "Browse by cause, location, availability, or interest — opportunities that actually fit your schedule and your neighborhood.",
  },
  {
    kicker: "Opportunity details",
    title: "See what you'll actually do",
    desc: "Each listing shows the organization, the activity, the time commitment, and your volunteer role before you commit.",
  },
  {
    kicker: "Your impact record",
    title: "Turn service into impact",
    desc: "Every opportunity you complete builds a shareable record of your involvement — meals packed, hours given, causes served.",
  },
];

const STATS = [
  { label: "Meals packed", value: "40" },
  { label: "Hours given", value: "12" },
  { label: "Causes served", value: "3" },
];
// Example values — not verified statistics.

export default function ValueProps() {
  return (
    <section className="bg-secondary/70 border-y border-border/60 py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Why Serve2Impact</h2>
          <p className="text-foreground/70 mt-1">Showing up should feel worth it.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-10 items-start">
          {/* Callouts — flat text, hairline dividers, no icon-on-top cards */}
          <div className="md:col-span-3 divide-y divide-border/60">
            {CALLOUTS.map((c) => (
              <div key={c.title} className="py-5 first:pt-0 last:pb-0">
                <p className="text-xs font-semibold text-accent">{c.kicker}</p>
                <h3 className="font-bold text-primary text-lg mt-1">{c.title}</h3>
                <p className="text-sm text-foreground/70 mt-1.5 leading-relaxed max-w-md">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Impact record — one elevated panel, flat inner structure */}
          <div className="md:col-span-2 rounded-2xl border border-border/70 bg-card p-6">
            <p className="font-hand text-accent text-xl leading-none">Your impact record</p>
            <p className="text-sm text-foreground/70 mt-2">Everything you give, tracked automatically.</p>
            <p className="text-xs text-foreground/45 mt-1">Example values shown.</p>
            <div className="mt-5 divide-y divide-border/60">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between py-3 first:pt-0 last:pb-0">
                  <span className="text-sm text-foreground/70">{s.label}</span>
                  <span className="text-2xl font-extrabold text-primary">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}