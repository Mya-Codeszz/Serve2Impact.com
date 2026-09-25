import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/lib/AuthContext";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { opportunityService } from "@/services/opportunities";
import { crewService } from "@/services/crews";
import Asset from "@/components/Asset";
import OpportunityCard from "@/components/OpportunityCard";
import { fmtDate } from "@/lib/s2i-data";

function StatCard({ label, value, suffix }) {
  return (
    <div className="paper rounded-xl border border-border/70 p-4 sm:p-5">
      <div className="font-hand text-accent text-lg">{label}</div>
      <div className="text-3xl font-extrabold text-primary mt-1">
        {value}{suffix && <span className="text-lg font-bold text-foreground/60 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, hint, ctaLabel, ctaLink }) {
  return (
    <div className="paper rounded-xl border border-border/70 p-6 text-center">
      <Asset name={icon} alt="" width={50} className="mx-auto mb-2" />
      <p className="font-hand text-xl text-foreground/70">{title}</p>
      {hint && <p className="text-foreground/60 text-sm mt-1">{hint}</p>}
      {ctaLabel && ctaLink && (
        <Link to={ctaLink} className="btn-grass inline-block mt-3 px-4 py-2 rounded-lg text-sm">{ctaLabel}</Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, hours, opportunitiesCompleted, streak, signups, impactByUnit, achievements } = useUserStats();
  const { savedIds } = useSavedOpportunities();
  const [allOpps, setAllOpps] = useState([]);
  const [crews, setCrews] = useState([]);
  const name = (user?.full_name || user?.email || "friend").split(" ")[0];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const upcoming = signups.filter((s) => s.status === "signed_up").slice(0, 4);
  const past = signups.filter((s) => s.status === "checked_in" || s.status === "completed").slice(0, 4);
  const myCrew = crews.find((c) => c.id === (user && user.joined_crew));

  useEffect(() => {
    opportunityService.list().then(setAllOpps).catch(() => {});
    crewService.list().then(setCrews).catch(() => {});
  }, []);

  const saved = allOpps.filter((o) => savedIds.includes(o.id)).slice(0, 3);
  const recommended = allOpps.filter((o) => !savedIds.includes(o.id)).slice(0, 3);
  const isDemo = signups.length === 0 && !loading;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Welcome back, {name}!</h1>
        <Asset name="welcome_back.png" alt="welcome back" width={150} className="rotate-neg-3 hidden sm:block" />
      </div>

      {isDemo && (
        <p className="text-xs text-foreground/50 bg-secondary/70 border border-border/60 rounded-full px-3 py-1 inline-block mb-6">
          No activity yet — showing empty states. Sign up for an opportunity to get started!
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Hours volunteered" value={hours} suffix="hrs" />
        <StatCard label="Opportunities" value={opportunitiesCompleted} />
        <StatCard label="Current streak" value={streak} suffix="days" />
        <StatCard label="Achievements" value={`${unlockedCount}/${achievements.length}`} />
      </div>

      {/* Streak */}
      <div className="paper rounded-xl border border-border/70 p-6 mb-10 relative">
        <Asset name="keep_going.png" alt="keep going" width={150} className="absolute -top-6 right-4 rotate-pos-4 hidden sm:block" />
        <h2 className="font-bold text-primary text-lg mb-1">Your streak</h2>
        <p className="font-hand text-3xl text-accent mb-4">{streak} days 🔥</p>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: 14 }).map((_, i) => {
            const filled = i < Math.min(streak, 14);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs ${filled ? "bg-accent text-white" : "bg-secondary text-foreground/40"}`}>
                  {filled ? <Asset name="star.png" alt="" width={16} /> : i + 1}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-foreground/60 mt-4">Keep showing up to grow your streak.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Upcoming</h2>
            <Link to="/browse" className="text-sm font-semibold text-accent hover:underline">Find more →</Link>
          </div>
          {loading ? (
            <div className="h-32 rounded-xl bg-secondary/60 animate-pulse" />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon="smiley.png"
              title="No adventures yet"
              hint="Find your first opportunity and sign up."
              ctaLabel="Browse opportunities →"
              ctaLink="/browse"
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => (
                <Link to={`/check-in/${s.opportunity_id}`} key={s.id} className="block paper rounded-xl border border-border/70 p-4 hover:border-accent transition-colors">
                  <p className="font-semibold text-primary">{s.opportunity_title}</p>
                  <p className="text-xs text-foreground/60">{s.organization} · {fmtDate(s.date)} · {s.start_time}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-accent">Check in →</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Past volunteering */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Past volunteering</h2>
            <Link to="/impact" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
          </div>
          {loading ? (
            <div className="h-32 rounded-xl bg-secondary/60 animate-pulse" />
          ) : past.length === 0 ? (
            <EmptyState
              icon="smiley.png"
              title="No past shifts yet"
              hint="Your completed opportunities will show up here."
            />
          ) : (
            <div className="space-y-3">
              {past.map((s) => (
                <div key={s.id} className="paper rounded-xl border border-border/70 p-4">
                  <p className="font-semibold text-primary">{s.opportunity_title}</p>
                  <p className="text-xs text-foreground/60">{s.organization} · {fmtDate(s.date)} · {s.hours || 0} hrs</p>
                  {s.impact_value ? (
                    <span className="inline-block mt-2 text-xs font-semibold text-accent">≈ {s.impact_value} {s.impact_unit}</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Impact snapshot + Achievements */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Your impact</h2>
            <Link to="/impact" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
          </div>
          <div className="paper rounded-xl border border-border/70 p-5 space-y-3">
            {Object.keys(impactByUnit).length === 0 ? (
              <p className="font-hand text-lg text-foreground/60">Your impact will show up here after your first shift.</p>
            ) : (
              Object.entries(impactByUnit).map(([unit, val]) => (
                <div key={unit} className="flex items-center justify-between">
                  <span className="text-foreground/70 capitalize">{unit}</span>
                  <span className="font-bold text-primary">{val}</span>
                </div>
              ))
            )}
            <Link to="/impact" className="btn-grass inline-block mt-2 px-4 py-2 rounded-lg text-sm">Get your impact receipt</Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Achievements</h2>
            <Link to="/achievements" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
          </div>
          <div className="paper rounded-xl border border-border/70 p-5">
            <div className="flex flex-wrap gap-3">
              {achievements.slice(0, 4).map((a) => (
                <div key={a.key} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${a.unlocked ? "bg-accent/10" : "bg-secondary/60"}`}>
                  <Asset name={`${a.icon}.png`} alt="" width={24} className={a.unlocked ? "" : "grayscale opacity-50"} />
                  <span className={`text-xs font-semibold ${a.unlocked ? "text-primary" : "text-foreground/50"}`}>{a.title}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground/60 mt-3">{unlockedCount} of {achievements.length} unlocked</p>
            <Link to="/achievements" className="inline-block mt-2 text-sm font-semibold text-accent hover:underline">View all achievements →</Link>
          </div>
        </div>
      </div>

      {/* Crew activity */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-primary text-lg">Crew activity</h2>
          <Link to="/crews" className="text-sm font-semibold text-accent hover:underline">{myCrew ? "Manage crew →" : "Join a crew →"}</Link>
        </div>
        {myCrew ? (
          <div className="paper rounded-xl border border-border/70 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Asset name="people.png" alt="" width={28} />
              </div>
              <div>
                <p className="font-bold text-primary">{myCrew.name}</p>
                <p className="text-xs text-foreground/60">{myCrew.members_count} members · {myCrew.shared_hours} {myCrew.goal_unit}</p>
              </div>
            </div>
            {myCrew.recent_activity && <p className="text-sm text-foreground/70 italic mt-2">"{myCrew.recent_activity}"</p>}
          </div>
        ) : (
          <EmptyState
            icon="people.png"
            title="No crew yet"
            hint="Volunteer with friends and track shared goals."
            ctaLabel="Find a crew →"
            ctaLink="/crews"
          />
        )}
      </div>

      {/* Saved + Recommended */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Saved</h2>
            <Link to="/saved" className="text-sm font-semibold text-accent hover:underline">See all →</Link>
          </div>
          {saved.length === 0 ? (
            <EmptyState
              icon="heart.png"
              title="No saved opportunities yet"
              hint="Tap the heart on any opportunity to save it."
              ctaLabel="Browse →"
              ctaLink="/browse"
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {saved.map((o) => <OpportunityCard key={o.id} opp={o} />)}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary text-lg">Recommended</h2>
            <Link to="/match" className="text-sm font-semibold text-accent hover:underline">Find your match →</Link>
          </div>
          {loading ? (
            <div className="h-32 rounded-xl bg-secondary/60 animate-pulse" />
          ) : recommended.length === 0 ? (
            <EmptyState icon="smiley.png" title="Nothing to recommend yet" hint="Opportunities will appear here once available." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {recommended.map((o) => <OpportunityCard key={o.id} opp={o} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}