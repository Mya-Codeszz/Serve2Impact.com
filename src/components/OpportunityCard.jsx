import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  CAUSE_EMOJI,
  causeColor,
  fmtDate,
  fmtDuration,
  fmtLocation,
  FORMAT_EMOJI,
  spotsLeft,
} from "@/lib/s2i-data";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";

function dayTime(opp) {
  try {
    const d = new Date(opp.date);
    if (isNaN(d)) return "";
    const day = d.toLocaleDateString(undefined, { weekday: "long" });
    const h = parseInt((opp.start_time || "").split(":")[0], 10);
    const tod = isNaN(h) ? "" : h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return tod ? `${day} ${tod}` : day;
  } catch {
    return "";
  }
}

// Photo-free opportunity card with save/bookmark, format + structured location.
export default function OpportunityCard({ opp }) {
  const { isSaved, toggle } = useSavedOpportunities();
  const left = spotsLeft(opp);
  const full = left <= 0;
  const when = dayTime(opp);
  const dur = fmtDuration(opp) || opp.time_commitment;
  const c = causeColor(opp.cause);
  const loc = fmtLocation(opp);
  const saved = isSaved(opp.id);

  return (
    <div className="relative group">
      <Link
        to={`/opportunity/${opp.id}`}
        className="block paper rounded-2xl border border-border/70 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
      >
        {/* Category header */}
        <div className="px-4 pt-4 pb-3" style={{ backgroundColor: c.bg }}>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full bg-card/80"
              style={{ color: c.text }}
            >
              {CAUSE_EMOJI[opp.cause]} {opp.cause}
            </span>
            {opp.format && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-card/60 text-foreground/70">
                {FORMAT_EMOJI[opp.format]} {opp.format}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-accent">{opp.organization}</p>
          <h3 className="font-bold text-primary leading-snug group-hover:text-accent transition-colors">{opp.title}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/70">
            {loc && <span className="inline-flex items-center gap-1">📍 {loc}</span>}
            <span className="inline-flex items-center gap-1">🗓️ {fmtDate(opp.date)}</span>
            {opp.start_time && <span className="inline-flex items-center gap-1">⏰ {opp.start_time}</span>}
            {dur && <span className="inline-flex items-center gap-1">⏳ {dur}</span>}
          </div>
          {when && <p className="font-hand text-sm text-accent leading-tight">{when}</p>}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-foreground/70">
              {full ? "Full" : opp.spots_total != null ? `${left} spot${left === 1 ? "" : "s"} left` : "Open"}
            </span>
            {opp.impact_value ? (
              <span className="font-hand text-base text-accent">≈ {opp.impact_value} {opp.impact_unit}</span>
            ) : null}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggle(opp.id)}
        aria-label={saved ? "Unsave opportunity" : "Save opportunity"}
        aria-pressed={saved}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
          saved
            ? "bg-highlight/90 border-highlight text-primary"
            : "bg-card/90 border-border/70 text-foreground/60 hover:text-accent hover:border-accent"
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}