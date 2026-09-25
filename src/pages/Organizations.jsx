import React from "react";
import Asset from "@/components/Asset";
import OrgOnboarding from "@/components/organizations/OrgOnboarding";

const BENEFITS = [
  { icon: "search.png", title: "Get discovered", desc: "Students browse by cause, location, and time — so the right people find your opportunities." },
  { icon: "people.png", title: "Manage volunteers", desc: "See signups, confirm attendance, and track who showed up — all in one place." },
  { icon: "earth.png", title: "Show your impact", desc: "Hours served and outcomes roll up into a community impact story you can share." },
];

const POST_EXAMPLES = ["One-time events", "Recurring shifts", "Group projects", "Skills-based roles"];

export default function Organizations() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">For organizations</h1>
        <p className="mt-2 text-foreground/70 max-w-lg mx-auto">
          Post opportunities, find committed student volunteers, and show the impact your work creates.
        </p>
        <Asset name="better_together.png" alt="better together" width={210} className="mx-auto mt-3" />
      </div>

      {/* Why use Serve2Impact */}
      <section className="grid sm:grid-cols-3 gap-6 mb-12">
        {BENEFITS.map((b) => (
          <div key={b.title} className="paper rounded-2xl border border-border/70 p-5 text-center">
            <div className="flex items-center justify-center mb-3"><Asset name={b.icon} alt="" width={56} /></div>
            <h3 className="font-bold text-primary mb-1">{b.title}</h3>
            <p className="text-sm text-foreground/70">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* What you can post + how students discover */}
      <section className="paper-cream rounded-2xl border border-border/70 p-6 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-extrabold text-primary mb-2">What you can post</h2>
            <p className="text-foreground/70 text-sm mb-4">Anything a student can show up for:</p>
            <div className="flex flex-wrap gap-2">
              {POST_EXAMPLES.map((p) => (
                <span key={p} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-card border border-border">{p}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Asset name="search.png" alt="" width={56} />
            <p className="text-foreground/70 text-sm leading-relaxed">
              Students discover your opportunity by cause, location, date, and duration — so the people who show up are the ones who actually fit.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-step onboarding flow */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Bring your organization on</h2>
          <p className="text-foreground/70 mt-1">A quick walkthrough to get you set up.</p>
        </div>
        <OrgOnboarding />
      </section>
    </div>
  );
}