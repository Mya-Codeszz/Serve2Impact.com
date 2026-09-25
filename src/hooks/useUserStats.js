import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { signupService } from "@/services/signups";
import { achievementService } from "@/services/achievements";

// Loads the current user's signups (via the service layer) and derives
// volunteer stats + achievements. Swap the service implementation during
// migration; this hook's interface stays the same.
export function useUserStats() {
  const { user } = useAuth();
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const list = await signupService.getMySignups(user.id);
        if (active) setSignups(list);
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [user]);

  const completed = signups.filter(
    (s) => s.status === "completed" || s.status === "checked_in"
  );
  const hours = completed.reduce((sum, s) => sum + (s.hours || 0), 0);
  const opportunitiesCompleted = completed.length;

  const impactByUnit = {};
  completed.forEach((s) => {
    if (s.impact_unit && s.impact_value) {
      impactByUnit[s.impact_unit] = (impactByUnit[s.impact_unit] || 0) + s.impact_value;
    }
  });

  // streak: consecutive days with a completed signup ending today/yesterday
  const days = new Set(completed.map((s) => (s.date || "").slice(0, 10)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 400; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i === 0) continue;
    else break;
  }

  const achievements = achievementService.compute(signups, user);

  return {
    signups,
    loading,
    hours: Math.round(hours * 10) / 10,
    opportunitiesCompleted,
    streak,
    impactByUnit,
    achievements,
  };
}