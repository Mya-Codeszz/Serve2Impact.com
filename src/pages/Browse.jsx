import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import Asset from "@/components/Asset";
import OpportunityCard from "@/components/OpportunityCard";
import { opportunityService } from "@/services/opportunities";
import {
  CAUSES,
  CAUSE_EMOJI,
  FORMATS,
  FORMAT_LABEL,
  AGE_OPTIONS,
  SKILL_OPTIONS,
  OPPORTUNITY_TYPES,
  durationMins,
} from "@/lib/s2i-data";

const DURATIONS = [
  { key: "any", label: "Any duration" },
  { key: "short", label: "Under 2 hours" },
  { key: "mid", label: "2–4 hours" },
  { key: "long", label: "4+ hours" },
];

function isWeekend(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const day = d.getDay();
  return day === 0 || day === 6;
}
function hourOf(opp) {
  return parseInt((opp.start_time || "").split(":")[0], 10);
}

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/70 overflow-hidden">
          <div className="h-16 bg-secondary/70 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-secondary animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-secondary animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-secondary/70 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const selectCls =
  "h-10 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function Browse() {
  const [params] = useSearchParams();
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [q, setQ] = useState(params.get("q") || "");
  const [cause, setCause] = useState("All");
  const [format, setFormat] = useState("All");
  const [location, setLocation] = useState("All");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("any");
  const [age, setAge] = useState("All");
  const [skill, setSkill] = useState("All");
  const [day, setDay] = useState("All");
  const [oppType, setOppType] = useState("All");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const list = await opportunityService.list();
      setOpps(list);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const locations = useMemo(() => {
    const set = new Set(
      opps
        .map((o) => o.city || o.location)
        .filter(Boolean)
        .filter((v) => v !== "Virtual")
    );
    return ["All", ...Array.from(set).sort()];
  }, [opps]);

  const filtered = useMemo(() => {
    return opps.filter((o) => {
      if (cause !== "All" && o.cause !== cause && !(o.causes || []).includes(cause)) return false;
      if (format !== "All" && o.format !== format) return false;
      if (location !== "All") {
        const loc = o.city || o.location;
        if (loc !== location) return false;
      }
      if (date && (o.date || "").slice(0, 10) !== date) return false;
      if (duration !== "any") {
        const m = durationMins(o);
        if (m == null) return false;
        if (duration === "short" && m >= 120) return false;
        if (duration === "mid" && (m < 120 || m > 240)) return false;
        if (duration === "long" && m < 240) return false;
      }
      if (age !== "All") {
        const ok = o.age_requirement === "All ages" || o.age_requirement === age;
        if (!ok) return false;
      }
      if (skill !== "All") {
        const has = (o.skills || []).some((s) => s === skill || s === "No experience needed" && skill === "No experience needed");
        if (!has) return false;
      }
      if (day !== "All") {
        if (["Weekdays", "Weekends"].includes(day)) {
          const we = isWeekend(o.date);
          if (day === "Weekdays" && we !== false) return false;
          if (day === "Weekends" && we !== true) return false;
        } else {
          const h = hourOf(o);
          if (isNaN(h)) return false;
          if (day === "Mornings" && h >= 12) return false;
          if (day === "Afternoons" && (h < 12 || h >= 17)) return false;
          if (day === "Evenings" && h < 17) return false;
        }
      }
      if (oppType !== "All" && o.opportunity_type !== oppType) return false;
      if (q) {
        const hay = `${o.title} ${o.organization} ${o.description} ${o.cause} ${(o.causes || []).join(" ")} ${o.location} ${o.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [opps, q, cause, format, location, date, duration, age, skill, day, oppType]);

  const primaryActive = q || cause !== "All" || format !== "All" || location !== "All" || date || duration !== "any";
  const moreActive = age !== "All" || skill !== "All" || day !== "All" || oppType !== "All";
  const hasFilters = primaryActive || moreActive;
  const clearAll = () => {
    setQ("");
    setCause("All");
    setFormat("All");
    setLocation("All");
    setDate("");
    setDuration("any");
    setAge("All");
    setSkill("All");
    setDay("All");
    setOppType("All");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Find something meaningful.</h1>
        <p className="mt-2 text-foreground/70 max-w-xl">
          Discover volunteer opportunities that fit your interests, location, and schedule.
        </p>
        <Asset name="find_something_good.png" alt="find something good" width={200} className="absolute -top-4 right-2 rotate-pos-4 hidden sm:block" />
      </div>

      {/* Search */}
      <div className="flex items-center bg-card rounded-2xl border border-border shadow-sm h-14 pl-5 pr-2 mb-5 max-w-2xl">
        <Search className="w-5 h-5 text-foreground/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, organization, or cause..."
          aria-label="Search opportunities"
          className="flex-1 bg-transparent outline-none px-3 text-base placeholder:text-foreground/40"
        />
      </div>

      {/* Primary filters */}
      <div className="relative z-20 flex flex-wrap gap-3 mb-3 items-center">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg h-10 px-3">
          <MapPin className="w-4 h-4 text-foreground/50" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Filter by location"
            className="bg-transparent outline-none text-sm font-medium text-foreground max-w-[10rem]"
          >
            {locations.map((l) => (
              <option key={l} value={l}>{l === "All" ? "All locations" : l}</option>
            ))}
          </select>
        </div>

        <select value={cause} onChange={(e) => setCause(e.target.value)} aria-label="Filter by category" className={selectCls}>
          <option value="All">All categories</option>
          {CAUSES.map((c) => <option key={c} value={c}>{CAUSE_EMOJI[c]} {c}</option>)}
        </select>

        <select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Filter by format" className={selectCls}>
          <option value="All">All formats</option>
          {FORMATS.map((f) => <option key={f} value={f}>{FORMAT_LABEL[f]}</option>)}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Filter by date"
          className={`${selectCls} max-w-[10rem]`}
        />

        <select value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Filter by duration" className={selectCls}>
          {DURATIONS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>

        <button
          type="button"
          onClick={() => setShowMore((s) => !s)}
          aria-expanded={showMore}
          className={`h-10 rounded-lg border px-3 text-sm font-semibold inline-flex items-center gap-1.5 ${moreActive ? "border-accent text-accent bg-accent/10" : "border-border text-foreground/70 bg-card"}`}
        >
          <SlidersHorizontal className="w-4 h-4" /> More filters
        </button>

        {hasFilters && (
          <button onClick={clearAll} className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Secondary filters */}
      {showMore && (
        <div className="relative z-20 flex flex-wrap gap-3 mb-8 items-center pt-1">
          <select value={age} onChange={(e) => setAge(e.target.value)} aria-label="Filter by age requirement" className={selectCls}>
            <option value="All">Any age</option>
            {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Filter by skill" className={selectCls}>
            <option value="All">Any skill</option>
            {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} aria-label="Filter by day/time" className={selectCls}>
            <option value="All">Any day/time</option>
            {["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={oppType} onChange={(e) => setOppType(e.target.value)} aria-label="Filter by opportunity type" className={selectCls}>
            <option value="All">Any type</option>
            {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}
      {!showMore && <div className="mb-8" />}

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className="text-center py-16">
          <Asset name="smiley.png" alt="" width={60} className="mx-auto mb-3" />
          <p className="font-hand text-2xl text-foreground/70">We couldn't load opportunities.</p>
          <button onClick={load} className="btn-grass mt-4 px-5 py-2.5 rounded-lg">Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Asset name="smiley.png" alt="" width={60} className="mx-auto mb-3" />
          <p className="font-hand text-2xl text-foreground/70">No opportunities found</p>
          <p className="text-foreground/60 mt-1">Try changing your filters or searching for another cause.</p>
          {hasFilters && (
            <button onClick={clearAll} className="btn-grass mt-4 px-5 py-2.5 rounded-lg">Clear filters</button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/60 mb-4">{filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((o) => <OpportunityCard key={o.id} opp={o} />)}
          </div>
        </>
      )}
    </div>
  );
}