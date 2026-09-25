import React from "react";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/lib/AuthContext";
import Asset from "@/components/Asset";
import { Link } from "react-router-dom";

export default function Achievements() {
  const { loading, achievements } = useUserStats();
  const { user } = useAuth();
  const isDemo = !loading && achievements.every((a) => !a.unlocked);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Achievements</h1>
        <p className="mt-2 text-foreground/70">Little badges for the big things you do.</p>
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-0 right-6 rotate-pos-4 hidden sm:block" />
      </div>

      {isDemo && (
        <p className="text-center text-xs text-foreground/50 bg-secondary/70 border border-border/60 rounded-full px-3 py-1 inline-block mb-6 mx-auto w-auto">
          No achievements unlocked yet — {user ? "complete an opportunity to earn your first badge!" : "sign up and volunteer to start earning badges!"}
        </p>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-sm text-foreground/60">{unlockedCount} of {achievements.length} unlocked</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((a) => {
              const pct = a.goal > 0 ? Math.min(100, Math.round((a.progress / a.goal) * 100)) : 0;
              return (
                <div
                  key={a.key}
                  className={`paper rounded-xl border p-5 text-center transition ${a.unlocked ? "border-accent" : "border-border/70 opacity-75"}`}
                >
                  <div className="flex items-center justify-center mb-3 relative">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${a.unlocked ? "bg-highlight/30" : "bg-secondary"}`}>
                      <Asset name={`${a.icon}.png`} alt="" width={44} className={a.unlocked ? "" : "grayscale opacity-50"} />
                    </div>
                    {a.unlocked && <Asset name="check.png" alt="" width={26} className="absolute -bottom-1 right-8" />}
                  </div>
                  <h3 className="font-bold text-primary">{a.title}</h3>
                  <p className="text-xs text-foreground/70 mt-1">{a.desc}</p>

                  {a.unlocked ? (
                    <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-accent text-white">
                      Unlocked
                    </span>
                  ) : (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-foreground/50 mb-1">
                        <span>{a.progress} / {a.goal}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-accent/60" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground/50">
                        Locked
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!loading && unlockedCount === 0 && (
            <div className="text-center mt-10">
              <Link to="/browse" className="btn-grass px-6 py-3 rounded-lg inline-block">
                Find your first opportunity →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}