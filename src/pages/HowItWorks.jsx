import React from "react";
import { Link } from "react-router-dom";
import Asset from "@/components/Asset";

const STEPS = [
  { icon: "search.png", title: "Find an opportunity", desc: "Browse by cause, location, and time — no sign-up needed to look around." },
  { icon: "check.png", title: "Sign up", desc: "Tap to join. Your shift shows up on your dashboard automatically." },
  { icon: "earth.png", title: "Show up", desc: "Check in when you arrive. Meet your crew and get to work." },
  { icon: "star.png", title: "Make an impact", desc: "Hours and outcomes roll up into your impact record and passport." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">How it works</h1>
        <p className="mt-2 text-foreground/70 max-w-lg mx-auto">Four simple steps from finding to showing up to seeing your impact grow.</p>
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-0 right-4 rotate-pos-4 hidden sm:block" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map((s, i) => (
          <div key={s.title} className="text-center paper rounded-xl border border-border/70 p-6 relative">
            <div className="flex items-center justify-center mb-3">
              <Asset name={s.icon} alt="" width={64} />
            </div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="font-hand text-accent text-xl">{i + 1}.</span>
              <h3 className="font-bold text-primary">{s.title}</h3>
            </div>
            <p className="text-sm text-foreground/70">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 text-accent/40 z-10" aria-hidden>
                →
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/browse" className="btn-grass px-6 py-3 rounded-lg inline-block">Browse opportunities</Link>
      </div>
    </div>
  );
}