import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Loader2, LogOut } from "lucide-react";
import Asset from "@/components/Asset";
import { Button } from "@/components/ui/button";
import { crewService } from "@/services/crews";
import { useAuth } from "@/lib/AuthContext";
import { CAUSE_EMOJI } from "@/lib/s2i-data";
import { toast } from "@/components/ui/use-toast";
import CrewForm from "@/components/crews/CrewForm";

export default function Crews() {
  const { user } = useAuth();
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [joining, setJoining] = useState(null);
  const joined = (user && user.joined_crew) || "";

  useEffect(() => {
    let active = true;
    crewService
      .list()
      .then((list) => active && setCrews(list))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const joinCrew = async (crew) => {
    if (!user) {
      toast({ title: "Log in to join a crew" });
      return;
    }
    if (joined === crew.id) return;
    setJoining(crew.id);
    try {
      const updated = await crewService.join(crew, user.id);
      setCrews((prev) => prev.map((c) => c.id === crew.id ? updated : c));
      toast({ title: `You joined ${crew.name}!`, description: "Better together. 🎉" });
      // Reload user context without full page reload
      window.location.reload();
    } catch (e) {
      toast({ title: "Couldn't join", description: e.message, variant: "destructive" });
    } finally {
      setJoining(null);
    }
  };

  const leaveCrew = async () => {
    if (!user) return;
    try {
      await crewService.leave(user.id);
      toast({ title: "You left your crew" });
      window.location.reload();
    } catch (e) {
      toast({ title: "Couldn't leave", description: e.message, variant: "destructive" });
    }
  };

  const handleCreate = (data) => {
    const newCrew = crewService.createDemo(data);
    setCrews((prev) => [newCrew, ...prev]);
    setShowForm(false);
    toast({ title: `${newCrew.name} created!`, description: "Invite your friends to join." });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="relative text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Better together</h1>
        <p className="mt-2 text-foreground/70">Join a crew, track shared hours, and reach goals as a team.</p>
        <Asset name="better_together.png" alt="better together" width={210} className="mx-auto mt-2" />
      </div>

      <div className="flex justify-center mb-8">
        <Button onClick={() => setShowForm(true)} className="btn-grass h-11 px-6">
          <Plus className="w-4 h-4 mr-1" /> Create a crew
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
      ) : crews.length === 0 ? (
        <div className="text-center py-16 paper rounded-2xl border border-border/70">
          <Asset name="people.png" alt="" width={60} className="mx-auto mb-3" />
          <p className="font-hand text-2xl text-foreground/70">No crews yet</p>
          <p className="text-foreground/60 mt-1">Be the first to start one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {crews.map((c) => {
            const pct = Math.min(100, Math.round(((c.shared_hours || 0) / (c.shared_goal || 1)) * 100));
            const isMember = joined === c.id;
            const isDemo = crewService.isDemo(c);
            return (
              <div key={c.id} className="paper rounded-xl border border-border/70 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Asset name="people.png" alt="" width={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary truncate">{c.name}</h3>
                    <p className="text-xs text-foreground/60">{c.members_count} member{(c.members_count || 0) === 1 ? "" : "s"}</p>
                  </div>
                  {isMember && (
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full shrink-0">Your crew</span>
                  )}
                </div>

                {c.cause && (
                  <p className="text-xs text-foreground/60 mb-2">{CAUSE_EMOJI[c.cause]} {c.cause}</p>
                )}

                <p className="text-sm text-foreground/70 mb-3">{c.description}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-foreground/60 mb-1">
                    <span>{c.shared_hours} / {c.shared_goal} {c.goal_unit}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {c.recent_activity && (
                  <p className="text-xs text-foreground/60 italic mb-3">"{c.recent_activity}"</p>
                )}

                {isDemo && (
                  <p className="text-xs text-foreground/40 mb-3">Demo crew — sample data</p>
                )}

                <div className="flex gap-2">
                  {!isMember ? (
                    <button
                      onClick={() => joinCrew(c)}
                      disabled={joining === c.id}
                      className="btn-grass px-4 py-2 rounded-lg text-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {joining === c.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Join crew
                    </button>
                  ) : (
                    <button
                      onClick={leaveCrew}
                      className="px-4 py-2 rounded-lg text-sm border border-border text-foreground/70 hover:border-destructive hover:text-destructive inline-flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Leave crew
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CrewForm onCreate={handleCreate} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}