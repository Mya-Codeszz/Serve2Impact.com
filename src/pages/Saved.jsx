import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, RotateCcw } from "lucide-react";
import Asset from "@/components/Asset";
import OpportunityCard from "@/components/OpportunityCard";
import { opportunityService } from "@/services/opportunities";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";

export default function Saved() {
  const { savedIds } = useSavedOpportunities();
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    opportunityService.list().then((l) => { setOpps(l); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const saved = opps.filter((o) => savedIds.includes(o.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Saved opportunities</h1>
        <p className="mt-2 text-foreground/70 max-w-xl">Things you want to come back to. Saved here on this device for now.</p>
        <Asset name="heart.png" alt="" width={40} className="absolute -top-2 right-2 rotate-pos-4 hidden sm:block" />
      </div>

      {loading ? (
        <p className="text-foreground/60">Loading…</p>
      ) : saved.length === 0 ? (
        <div className="text-center py-16 paper rounded-2xl border border-border/70">
          <Heart className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
          <p className="font-hand text-2xl text-foreground/70">No saved opportunities yet</p>
          <p className="text-foreground/60 mt-1">Tap the heart on any opportunity to save it here.</p>
          <Link to="/browse" className="btn-grass mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg">
            <RotateCcw className="w-4 h-4" /> Explore opportunities
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/60 mb-4">{saved.length} saved</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map((o) => <OpportunityCard key={o.id} opp={o} />)}
          </div>
        </>
      )}
    </div>
  );
}