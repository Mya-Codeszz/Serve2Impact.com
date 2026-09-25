import React from "react";
import { Link } from "react-router-dom";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/lib/AuthContext";
import Asset from "@/components/Asset";
import { CAUSE_EMOJI, causeColor, fmtDate } from "@/lib/s2i-data";

export default function Profile() {
  const { user } = useAuth();
  const { loading, hours, opportunitiesCompleted, impactByUnit, achievements, signups } = useUserStats();
  const name = user?.full_name || "Volunteer";
  const email = user?.email || "";
  const causes = Array.from(new Set(signups.map((s) => s.cause).filter(Boolean)));
  const unlocked = achievements.filter((a) => a.unlocked);
  const completed = signups.filter((s) => s.status === "checked_in" || s.status === "completed");

  if (loading) {
    return <div className="py-24 flex justify-center"><div className="w-8 h-8 border-4 border-secondary border-t-accent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="paper rounded-xl border border-border/70 p-6 mb-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-extrabold shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-primary truncate">{name}</h1>
          <p className="text-sm text-foreground/60 truncate">{email}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="font-semibold text-accent">Level {Math.floor(hours / 10) + 1}</span>
            <span className="text-foreground/70">{hours} hrs</span>
            <span className="text-foreground/70">{opportunitiesCompleted} completed</span>
          </div>
        </div>
        <Asset name="sprout.png" alt="" width={60} className="hidden sm:block shrink-0" />
      </div>

      {/* Passport */}
      <div className="paper-cream rounded-lg border-2 border-dashed border-border p-6 relative mb-8" style={{ boxShadow: "3px 4px 0 rgba(31,58,40,0.08)" }}>
        <div className="tape left-1/2 -top-3 -translate-x-1/2" />
        <div className="flex items-center gap-2 mb-4">
          <Asset name="earth.png" alt="" width={36} />
          <h2 className="font-extrabold text-primary tracking-wide">VOLUNTEER PASSPORT</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="dashed-rule pb-2">
            <span className="text-foreground/60">Opportunities completed</span>
            <p className="font-bold text-primary text-lg">{opportunitiesCompleted}</p>
          </div>
          <div className="dashed-rule pb-2">
            <span className="text-foreground/60">Hours</span>
            <p className="font-bold text-primary text-lg">{hours}</p>
          </div>
          <div className="dashed-rule pb-2">
            <span className="text-foreground/60">Causes</span>
            <p className="font-bold text-primary text-lg">{causes.length || "—"}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {causes.map((c) => <span key={c} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{CAUSE_EMOJI[c]} {c}</span>)}
            </div>
          </div>
          <div className="dashed-rule pb-2">
            <span className="text-foreground/60">Badges</span>
            <p className="font-bold text-primary text-lg">{unlocked.length}</p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-foreground/60 text-sm">Impact</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.keys(impactByUnit).length === 0 ? (
              <p className="font-hand text-lg text-foreground/60">Your impact shows up here after your first shift.</p>
            ) : (
              Object.entries(impactByUnit).map(([unit, val]) => (
                <span key={unit} className="paper px-3 py-1 rounded border border-border text-sm capitalize">{val} {unit}</span>
              ))
            )}
          </div>
        </div>

        {/* Passport stamp */}
        <div className="mt-6 flex items-center gap-5 pt-4 border-t border-dashed border-border">
          {opportunitiesCompleted > 0 ? (
            <div style={{ mixBlendMode: "screen" }} className="shrink-0 -my-2">
              <Asset name="passport_stamp.png" alt="I showed up" width={130} />
            </div>
          ) : (
            <div className="shrink-0 w-[130px] h-[130px] rounded-full border-2 border-dashed border-border/70 flex items-center justify-center text-center px-3">
              <span className="font-hand text-sm text-foreground/50 leading-tight">first stamp<br/>waiting</span>
            </div>
          )}
          <div>
            <p className="font-hand text-2xl text-primary leading-tight">
              {opportunitiesCompleted > 0 ? "I SHOWED UP" : "Your passport is waiting"}
            </p>
            <p className="text-sm text-foreground/60 mt-0.5">
              {opportunitiesCompleted > 0
                ? `${opportunitiesCompleted} opportunit${opportunitiesCompleted === 1 ? "y" : "ies"} stamped`
                : "Complete your first opportunity to earn it."}
            </p>
          </div>
        </div>
      </div>

      {/* Cause stamps */}
      {causes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-primary text-lg mb-4">Cause stamps</h2>
          <div className="flex flex-wrap gap-4">
            {causes.map((c) => {
              const col = causeColor(c);
              const count = completed.filter((s) => s.cause === c).length;
              return (
                <div
                  key={c}
                  className="paper rounded-lg border-2 border-dashed border-border/60 p-4 text-center w-32 shrink-0"
                  style={{ backgroundColor: col.bg, transform: `rotate(${[-3, 2, -1, 3][causes.indexOf(c) % 4]}deg)` }}
                >
                  <div className="text-2xl mb-1" aria-hidden>{CAUSE_EMOJI[c]}</div>
                  <p className="text-xs font-bold" style={{ color: col.text }}>{c}</p>
                  <p className="text-xs mt-1" style={{ color: col.text }}>{count}x</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary text-lg">Achievements</h2>
          <Link to="/achievements" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
        </div>
        {unlocked.length === 0 ? (
          <div className="paper rounded-xl border border-border/70 p-5 text-center">
            <p className="font-hand text-lg text-foreground/60">No badges yet — complete an opportunity to earn your first!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {unlocked.map((a) => (
              <div key={a.key} className="paper rounded-xl border border-accent p-3 flex items-center gap-2">
                <Asset name={`${a.icon}.png`} alt="" width={28} />
                <span className="text-sm font-semibold text-primary">{a.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Volunteer history */}
      <div>
        <h2 className="font-bold text-primary text-lg mb-4">Volunteer history</h2>
        {completed.length === 0 ? (
          <div className="paper rounded-xl border border-border/70 p-6 text-center">
            <Asset name="smiley.png" alt="" width={50} className="mx-auto mb-2" />
            <p className="font-hand text-xl text-foreground/70">No adventures yet</p>
            <p className="text-foreground/60 text-sm mt-1">Complete your first opportunity to start your history.</p>
            <Link to="/browse" className="btn-grass inline-block mt-3 px-4 py-2 rounded-lg text-sm">Find your first opportunity →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {completed.map((s) => (
              <div key={s.id} className="paper rounded-xl border border-border/70 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0" aria-hidden>
                  <span className="text-lg">{CAUSE_EMOJI[s.cause] || "🌱"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary truncate">{s.opportunity_title}</p>
                  <p className="text-xs text-foreground/60">{s.organization} · {fmtDate(s.date)} · {s.hours || 0} hrs</p>
                </div>
                {s.impact_value ? (
                  <span className="font-hand text-base text-accent shrink-0">≈ {s.impact_value} {s.impact_unit}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}