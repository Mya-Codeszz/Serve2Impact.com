// Crews data-access service. Tries Base44, falls back to demo crews.
//
// Join/leave update both the user's joined_crew field and the crew's
// member count. Crew creation is frontend/demo for now — there is no
// production crew backend. The interface matches a future DB-backed service.

import { base44 } from "@/api/base44Client";
import { MOCK_CREWS } from "@/data/mock";

export function normalizeCrew(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name || "Crew",
    description: c.description || "",
    image_url: c.image_url || "",
    cause: c.cause || "",
    members_count: c.members_count || 0,
    shared_hours: c.shared_hours || 0,
    shared_goal: c.shared_goal || 0,
    goal_unit: c.goal_unit || "",
    recent_activity: c.recent_activity || "",
  };
}

export const crewService = {
  async list() {
    try {
      const items = await base44.entities.Crew.list("-created_date", 50);
      const normalized = (items || []).map(normalizeCrew).filter(Boolean);
      return normalized.length ? normalized : MOCK_CREWS.map(normalizeCrew);
    } catch {
      return MOCK_CREWS.map(normalizeCrew);
    }
  },

  isDemo(crew) {
    return !!crew && typeof crew.id === "string" && crew.id.startsWith("demo-");
  },

  async join(crew, userId) {
    if (!userId) throw new Error("Log in to join a crew");
    await base44.auth.updateMe({ joined_crew: crew.id });
    // Best-effort member count increment — non-fatal if it fails (demo crews)
    try {
      if (!this.isDemo(crew)) {
        await base44.entities.Crew.update(crew.id, {
          members_count: (crew.members_count || 0) + 1,
        });
      }
    } catch { /* ignore */ }
    return normalizeCrew({ ...crew, members_count: (crew.members_count || 0) + 1 });
  },

  async leave(userId) {
    await base44.auth.updateMe({ joined_crew: "" });
  },

  // Crew creation is frontend/demo for now — there is no production crew backend.
  // Returns a locally-shaped crew object so the UI can show it immediately.
  createDemo({ name, description, cause, image_url }) {
    const id = `demo-crew-${Date.now()}`;
    return normalizeCrew({
      id,
      name,
      description: description || "",
      image_url: image_url || "",
      cause: cause || "",
      members_count: 1,
      shared_hours: 0,
      shared_goal: 50,
      goal_unit: cause ? `${cause} actions` : "hours",
      recent_activity: "Just started — invite your friends!",
    });
  },
};