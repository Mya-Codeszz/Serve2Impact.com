import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Asset from "@/components/Asset";
import OpportunityCard from "@/components/OpportunityCard";
import InteractiveEarth from "@/components/InteractiveEarth";
import SocialProof from "@/components/SocialProof";
import BrowserMockup from "@/components/BrowserMockup";
import ValueProps from "@/components/ValueProps";
import ProductFlow from "@/components/ProductFlow";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import { opportunityService } from "@/services/opportunities";

export default function Home() {
  const [q, setQ] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    opportunityService
      .featured(6)
      .then((list) => active && setFeatured(list))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (searching) return;
    setSearching(true);
    setTimeout(() => {
      navigate(`/browse${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    }, 950);
  };

  const focusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-16 md:pt-6 md:pb-20 grid md:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <div className="relative z-10">
            <h1 className="font-hand text-primary leading-[1.05] text-balance" style={{ fontSize: "clamp(2.6rem, 6vw, 4.6rem)" }}>
              Good people
              <br />
              do great things.
            </h1>

            <p className="mt-7 max-w-md text-foreground/75 text-lg leading-relaxed">
              Find a volunteer opportunity near you and get rewarded for showing up.
            </p>

            <form onSubmit={onSearch} className="mt-6 relative max-w-xl">
              <div className={`flex items-center bg-card rounded-2xl border border-border shadow-sm h-[68px] pl-6 pr-2 transition-shadow ${searching ? "ring-2 ring-accent/40" : ""}`}>
                <Search className="w-5 h-5 text-foreground/40 shrink-0" />
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by city, cause, or keyword..."
                  className="flex-1 bg-transparent outline-none px-3 text-base placeholder:text-foreground/40"
                />
                <button type="submit" aria-label="Search" className="w-12 h-12 rounded-full btn-grass flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            <button type="button" onClick={focusSearch} className="mt-3 pl-2 block cursor-pointer transition-transform hover:translate-x-1" aria-label="Start here — focus search">
              <Asset name="start_here.png" alt="start here" width={160} className="rotate-neg-5" />
            </button>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/browse" className="btn-grass px-6 h-12 rounded-full inline-flex items-center justify-center font-semibold text-sm">
                Explore opportunities
              </Link>
              <Link to="/match" className="px-5 h-12 rounded-full inline-flex items-center justify-center font-semibold text-sm border border-border bg-card text-primary hover:border-accent transition-colors">
                Find your match
              </Link>
              <Link to="/how-it-works" className="px-5 h-12 rounded-full inline-flex items-center justify-center font-semibold text-sm border border-border bg-card text-primary hover:border-accent transition-colors">
                How it works
              </Link>
            </div>
          </div>

          {/* Right — Earth composition */}
          <div className="relative min-h-[340px] md:min-h-[560px] flex items-start justify-center">
            <Asset name="sun.png" alt="" className="absolute top-0 right-16 md:right-20" width={72} />
            <Asset name="burst.png" alt="" className="absolute top-10 left-4" width={42} />
            <Asset name="sparkles.png" alt="" className="absolute bottom-12 left-2" width={50} />
            <Asset name="star.png" alt="" className="absolute top-16 left-1/2" width={34} />
            <Asset name="heart.png" alt="" className="absolute bottom-24 right-6" width={30} />
            <Asset name="circle.png" alt="" className="absolute top-1/3 right-2" width={40} />

            <InteractiveEarth searching={searching} width={560} />
            {searching && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-hand text-xl text-accent z-30 whitespace-nowrap">
                finding something meaningful…
              </p>
            )}

            <Asset name="real_people_real_change.png" alt="real people, real change" width={210} className="absolute bottom-6 right-4 md:right-10 z-20" />
          </div>
        </div>

        <SocialProof />
      </section>

      {/* BROWSER MOCKUP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <BrowserMockup opportunities={featured} />
      </section>

      {/* HOW IT WORKS — product flow */}
      <ProductFlow />

      {/* FEATURED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Recommended opportunities</h2>
          <Link to="/browse" className="text-sm font-semibold text-accent hover:underline">Browse all →</Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-secondary/60 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-foreground/60">Opportunities coming soon — check back shortly!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((o) => <OpportunityCard key={o.id} opp={o} />)}
          </div>
        )}
      </section>

      <ValueProps />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}