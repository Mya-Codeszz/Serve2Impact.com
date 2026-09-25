import React from "react";

const QUOTES = [
  { quote: "I showed up to pack meals not knowing anyone — I left with three new friends and a sore back. Worth it.", name: "Maya R.", school: "Roosevelt High" },
  { quote: "It finally feels like my hours actually count for something. I can see exactly what I gave back.", name: "Devin K.", school: "Lincoln Prep" },
  { quote: "Found a creek cleanup ten minutes from my house. Now my whole crew goes every month.", name: "Priya S.", school: "Westfield Academy" },
];

// Quote-focused testimonials — no profile pictures, no headshots, no stock photos.
export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Students are already showing up</h2>
        <p className="text-foreground/70 mt-1">Example stories — demo content.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUOTES.map((q, i) => (
          <figure key={i} className="paper rounded-2xl border border-border/70 p-6 flex flex-col">
            <span className="font-hand text-4xl text-accent leading-none mb-1" aria-hidden>"</span>
            <blockquote className="text-foreground/80 leading-relaxed flex-1">{q.quote}</blockquote>
            <figcaption className="mt-4 pt-3 border-t border-dashed border-border">
              <p className="font-bold text-primary">{q.name}</p>
              <p className="text-sm text-foreground/60">{q.school}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}