// Signups data-access service.
//
// Today: uses the Base44 Signup entity when a user is authenticated. When the
// opportunity is a demo/mock record, a Signup is still created (the mock id is
// just a string) so the upcoming/check-in/impact flow works end-to-end.
//
// The frontend never claims a backend save that didn't happen — if a call
// fails, the caller is expected to surface an honest error.

import { base44 } from "@/api/base44Client";

export function normalizeSignup(s) {
  if (!s) return null;
  return {
    id: s.id,
    opportunity_id: s.opportunity_id || "",
    opportunity_title: s.opportunity_title || "",
    organization: s.organization || "",
    cause: s.cause || "",
    date: s.date || "",
    start_time: s.start_time || "",
    end_time: s.end_time || "",
    location: s.location || "",
    impact_unit: s.impact_unit || "",
    impact_value: s.impact_value ?? null,
    status: s.status || "signed_up",
    checked_in_at: s.checked_in_at || null,
    hours: s.hours ?? null,
    created_date: s.created_date || null,
  };
}

export const signupService = {
  async getMySignups(userId) {
    if (!userId) return [];
    try {
      const items = await base44.entities.Signup.filter(
        { created_by_id: userId },
        "-created_date",
        200
      );
      return (items || []).map(normalizeSignup).filter(Boolean);
    } catch {
      return [];
    }
  },

  async getForOpportunity(opportunityId, userId) {
    if (!opportunityId || !userId) return [];
    try {
      const items = await base44.entities.Signup.filter(
        { opportunity_id: opportunityId, created_by_id: userId },
        "-created_date",
        1
      );
      return (items || []).map(normalizeSignup).filter(Boolean);
    } catch {
      return [];
    }
  },

  async create(opp, userId) {
    const s = await base44.entities.Signup.create({
      opportunity_id: opp.id,
      opportunity_title: opp.title,
      organization: opp.organization,
      cause: opp.cause,
      date: opp.date,
      start_time: opp.start_time,
      end_time: opp.end_time,
      location: opp.location,
      impact_unit: opp.impact_unit,
      impact_value: opp.impact_value,
      status: "signed_up",
    });
    return normalizeSignup(s);
  },

  async checkIn(signupId) {
    const s = await base44.entities.Signup.update(signupId, {
      status: "checked_in",
      checked_in_at: new Date().toISOString(),
      hours: 3,
    });
    return normalizeSignup(s);
  },

  async cancel(signupId) {
    return base44.entities.Signup.delete(signupId);
  },
};