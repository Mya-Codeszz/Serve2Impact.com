import React from "react";
import { Link } from "react-router-dom";
import Asset from "./Asset";
import Polaroid from "./Polaroid";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-secondary/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-1.5 text-xl font-extrabold text-primary">
            Serve<span style={{ color: "hsl(var(--sky))" }}>2</span>Impact
          </Link>
          <p className="font-hand text-lg text-foreground/70 leading-snug">Good people do great things.</p>
          <Asset name="sprout.png" width={48} alt="" />
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-primary">Explore</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
            <li><Link to="/browse" className="hover:text-accent">Opportunities</Link></li>
            <li><Link to="/how-it-works" className="hover:text-accent">How it works</Link></li>
            <li><Link to="/stories" className="hover:text-accent">Stories</Link></li>
            <li><Link to="/organizations" className="hover:text-accent">For Organizations</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-primary">Resources</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/register" className="hover:text-accent">For volunteers</Link></li>
            <li><Link to="/impact" className="hover:text-accent">Your impact</Link></li>
            <li><Link to="/crews" className="hover:text-accent">Crews</Link></li>
          </ul>
        </div>

        <div className="flex items-start gap-3 flex-wrap">
          <Polaroid rotate="rotate(-4deg)" caption="grow">
            <Asset name="sprout.png" alt="" width={70} />
          </Polaroid>
          <Polaroid rotate="rotate(3deg)" caption="show up">
            <Asset name="star.png" alt="" width={70} />
          </Polaroid>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} Serve2Impact — made by hand, with care.
      </div>
    </footer>
  );
}