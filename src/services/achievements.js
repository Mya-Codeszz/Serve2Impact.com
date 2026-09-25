// Achievements service.
//
// Achievements are COMPUTED from a user's signups today (not persisted to a
// database). This keeps the logic centralized and reusable so a future backend
// can persist unlock events without changing call sites.

import { ACHIEVEMENTS } from "@/lib/s2i-data";

// signups: normalized signup list (see services/signups.js)
// user: current user object (for joined_crew)
// Returns: [{ ...achievement, unlocked, progress, goal }]
export function computeAchievements(signups = [], user = null) {
  const completed = signups.filter(
    (s) => s.status === "completed" || s.status === "checked_in"
  );
  const completedCount = completed.length;
  const hours = completed.reduce((sum, s) => sum + (s.hours || 0), 0);
  const causesTouched = new Set(completed.map((s) => s.cause).filter(Boolean));
  const envCount = completed.filter((s) => s.cause === "Environment").length;
  const joinedCrew = !!(user && user.joined_crew);
  const signedUpCount = signups.length;

  const state = {
    first_step: { progress: Math.min(completedCount, 1), unlocked: completedCount >= 1 },
    cause_explorer: { progress: Math.min(causesTouched.size, 3), unlocked: causesTouched.size >= 3 },
    community_builder: { progress: Math.min(completedCount, 5), unlocked: completedCount >= 5 },
    earth_helper: { progress: Math.min(envCount, 3), unlocked: envCount >= 3 },
    crew_leader: { progress: joinedCrew ? 1 : 0, unlocked: joinedCrew },
    changemaker: { progress: Math.min(hours, 50), unlocked: hours >= 50 },
  };

  // first_step counts a signup even before completion for a friendlier first run.
  if (!state.first_step.unlocked && signedUpCount > 0) {
    state.first_step = { progress: 1, unlocked: true };
  }

  return ACHIEVEMENTS.map((a) => ({
    ...a,
    goal: a.goal,
    progress: state[a.key]?.progress ?? 0,
    unlocked: !!state[a.key]?.unlocked,
  }));
}

export const achievementService = {
  compute: computeAchievements,
  list() {
    return ACHIEVEMENTS;
  },
};