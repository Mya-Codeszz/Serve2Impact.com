import React from "react";
import { Link } from "react-router-dom";
import Asset from "@/components/Asset";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10 relative">
        <h1 className="font-hand text-primary leading-tight" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
          Good people do great things.
        </h1>
        <Asset name="underline.png" alt="" width={240} className="mx-auto -mt-2" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <p className="text-lg text-foreground/80 leading-relaxed">
          Serve2Impact exists to make volunteering feel like what it really is — a way to show up for your
          neighbors, your block, and your planet. We connect people with organizations doing real work, and we
          help you see the difference you make, hour by hour.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Asset name="people.png" alt="" width={150} />
          <Asset name="earth.png" alt="" width={120} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { t: "Community first", d: "We build around real neighborhoods and the people in them." },
          { t: "Accessible to everyone", d: "Opportunities for every schedule, age, and ability." },
          { t: "Meaningful work", d: "Every shift ties to real impact you can measure." },
          { t: "Real-world impact", d: "Track meals packed, trees planted, hours given back." },
          { t: "Connecting people", d: "Link volunteers with the organizations that need them." },
          { t: "Better together", d: "Bring your crew and volunteer as a team." },
        ].map((c) => (
          <div key={c.t} className="paper rounded-xl border border-border/70 p-5">
            <h3 className="font-bold text-primary mb-1">{c.t}</h3>
            <p className="text-sm text-foreground/70">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/browse" className="btn-grass px-6 py-3 rounded-lg inline-block">Start volunteering</Link>
      </div>
    </div>
  );
}