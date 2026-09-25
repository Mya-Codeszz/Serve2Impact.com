import React from "react";
import { Link } from "react-router-dom";
import Asset from "./Asset";

export default function FinalCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
      <div className="paper-cream rounded-3xl border-2 border-dashed border-border p-8 sm:p-12 text-center relative overflow-hidden">
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-4 left-4 rotate-neg-5 hidden sm:block" />
        <Asset name="star.png" alt="" width={40} className="absolute bottom-4 right-6 rotate-pos-4 hidden sm:block" />
        <h2 className="font-hand text-primary leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Good people do great things.
        </h2>
        <p className="text-foreground/75 mt-3 max-w-md mx-auto">
          Join students turning everyday moments into real community impact.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn-grass px-7 h-12 rounded-full inline-flex items-center justify-center font-semibold text-sm">
            Join Serve2Impact
          </Link>
          <Link to="/browse" className="px-6 h-12 rounded-full inline-flex items-center justify-center font-semibold text-sm border border-border bg-card text-primary hover:border-accent transition-colors">
            Explore opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}