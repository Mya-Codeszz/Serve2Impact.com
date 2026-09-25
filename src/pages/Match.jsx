import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, RotateCcw, Sparkles } from "lucide-react";
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
} from "@/lib/s2i-data";

// A frontend-only "Find your match" experience.
// Recommendations are filtered/scored from the current opportunity list using
// the student's selections — NOT a scientific or statistical personalization.
// The scoring is intentionally simple and isolated so a real matching backend
// can replace it later without touching the UI.

const TIME_OPTIONS = ["Under 2 hours", "2–4 hours", "4+ hours", "Flexible"];
const DAY_OPTIONS = ["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"];

function durationBucket(opp) {
  const [sh, sm] = (opp.start_time || "").split(":").map(Number);
  const [eh, em] = (opp.end_time || "").split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => isNaN(n))) return "Flexible";
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  if (mins < 120) return "Under 2 hours";
  if (mins <= 240) return "2–4 hours";
  return "4+ hours";
}

function hourOf(opp) {
  return parseInt((opp.start_time || "").split(":")[0], 10);
}
function isWeekend(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const day = d.getDay();
  return day === 0 || day === 6;
}

function scoreOpp(opp, sel) {
  let score = 0;
  const causes = sel.causes || [];
  if (causes.length) {
    if (causes.includes(opp.cause)) score += 3;
    if ((opp.causes || []).some((c) => causes.includes(c))) score += 1;
  }
  if (sel.format && sel.format !== "any" && opp.format === sel.format) score += 2;
  if (sel.location && sel.location !== "All") {
    const loc = (opp.city || opp.location || "").toLowerCase();
    if (loc && loc.includes(sel.location.toLowerCase())) score += 1;
  }
  if (sel.time && sel.time !== "Flexible" && durationBucket(opp) === sel.time) score += 1;
  if (sel.age && sel.age !== "All") {
    if (opp.age_requirement === "All ages" || opp.age_requirement === sel.age) score += 1;
  }
  (sel.days || []).forEach((d) => {
    if (["Weekdays", "Weekends"].includes(d)) {
      const we = isWeekend(opp.date);
      if (d === "Weekdays" && we === false) score += 1;
      if (d === "Weekends" && we === true) score += 1;
    } else {
      const h = hourOf(opp);
      if (!isNaN(h)) {
        if (d === "Mornings" && h < 12) score += 1;
        if (d === "Afternoons" && h >= 12 && h < 17) score += 1;
        if (d === "Evenings" && h >= 17) score += 1;
      }
    }
  });
  (sel.skills || []).forEach((s) => {
    if ((opp.skills || []).includes(s)) score += 1;
  });
  return score;
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-sm font-semibold px-3.5 py-2 rounded-full border transition-colors ${
        active ? "bg-accent text-accent-foreground border-accent" : "bg-card text-foreground/75 border-border hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

function Section({ title, hint, children }) {
  return (
    <div className="paper rounded-2xl border border-border/70 p-5">
      <p className="font-semibold text-primary">{title}</p>
      {hint && <p className="text-xs text-foreground/55 mt-0.5 mb-3">{hint}</p>}
      {!hint && <div className="mb-3" />}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function Match() {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [causes, setCauses] = useState([]);
  const [format, setFormat] = useState("any");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("Flexible");
  const [age, setAge] = useState("All");
  const [days, setDays] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    opportunityService.list().then((l) => { setOpps(l); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleIn = (setter, list, val) => () =>
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const results = useMemo(() => {
    if (!submitted) return [];
    const sel = { causes, format, location, time, age, days, skills };
    return opps
      .map((o) => ({ o, score: scoreOpp(o, sel) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.o);
  }, [submitted, opps, causes, format, location, time, age, days, skills]);

  const reset = () => {
    setCauses([]); setFormat("any"); setLocation(""); setTime("Flexible"); setAge("All"); setDays([]); setSkills([]);
    setSubmitted(false);
  };

  const canSubmit = causes.length || format !== "any" || location || time !== "Flexible" || age !== "All" || days.length || skills.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-3">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Find your match</h1>
        <p className="mt-2 text-foreground/70 max-w-lg mx-auto">
          Tell us what fits you. We'll show opportunities that line up with what you picked.
        </p>
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-0 right-2 rotate-pos-4 hidden sm:block" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Section title="Causes you care about" hint="Pick as many as you like.">
          {CAUSES.map((c) => (
            <Chip key={c} active={causes.includes(c)} onClick={toggleIn(setCauses, causes, c)}>
              {CAUSE_EMOJI[c]} {c}
            </Chip>
          ))}
        </Section>

        <Section title="Format">
          <Chip active={format === "any"} onClick={() => setFormat("any")}>Any</Chip>
          {FORMATS.map((f) => (
            <Chip key={f} active={format === f} onClick={() => setFormat(f)}>{FORMAT_LABEL[f]}</Chip>
          ))}
        </Section>

        <Section title="Where" hint="City, neighborhood, or leave blank.">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Riverside or Virtual"
            aria-label="Preferred location"
            className="flex-1 min-w-[12rem] h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </Section>

        <Section title="Time commitment">
          {TIME_OPTIONS.map((t) => (
            <Chip key={t} active={time === t} onClick={() => setTime(t)}>{t}</Chip>
          ))}
        </Section>

        <Section title="Days & times" hint="Pick what works for your schedule.">
          {DAY_OPTIONS.map((d) => (
            <Chip key={d} active={days.includes(d)} onClick={toggleIn(setDays, days, d)}>{d}</Chip>
          ))}
        </Section>

        <Section title="Skills & interests">
          <Chip active={age === "All"} onClick={() => setAge("All")}>Any age</Chip>
          {AGE_OPTIONS.filter((a) => a !== "All ages").map((a) => (
            <Chip key={a} active={age === a} onClick={() => setAge(a)}>{a}</Chip>
          ))}
          <span className="w-full h-px bg-border/60 my-1" />
          {SKILL_OPTIONS.map((s) => (
            <Chip key={s} active={skills.includes(s)} onClick={toggleIn(setSkills, skills, s)}>{s}</Chip>
          ))}
        </Section>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="btn-grass px-7 h-12 rounded-full font-semibold disabled:opacity-50 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Show my matches
        </button>
        <button onClick={reset} className="px-5 h-12 rounded-full border border-border bg-card text-primary font-semibold inline-flex items-center gap-2 hover:border-accent">
          <RotateCcw className="w-4 h-4" /> Start over
        </button>
      </div>

      {submitted && (
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-primary">Based on what you selected</h2>
            <Link to="/browse" className="text-sm font-semibold text-accent hover:underline">Browse all →</Link>
          </div>
          {loading ? (
            <p className="text-foreground/60">Finding matches…</p>
          ) : results.length === 0 ? (
            <div className="text-center py-12 paper rounded-2xl border border-border/70">
              <Asset name="smiley.png" alt="" width={60} className="mx-auto mb-3" />
              <p className="font-hand text-2xl text-foreground/70">No matches this time</p>
              <p className="text-foreground/60 mt-1">Try fewer filters or a different combination.</p>
              <button onClick={reset} className="btn-grass mt-4 px-5 py-2.5 rounded-lg">Adjust choices</button>
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground/60 mb-4">{results.length} opportunit{results.length === 1 ? "y" : "ies"} that fit</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((o) => <OpportunityCard key={o.id} opp={o} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}