// Opportunities data-access service.
//
// Pages call these functions instead of touching Base44 directly, so the data
// source can be swapped (Base44 -> Supabase -> anything) without rewriting UI.
//
// Today: tries the Base44 entity first; if it returns nothing (or errors), it
// falls back to the centralized demo dataset so the frontend always works.
// Migration: replace the internals of each method — keep the signatures.

import { base44 } from "@/api/base44Client";
import { MOCK_OPPORTUNITIES } from "@/data/mock";

// Normalize any opportunity record (Base44 or mock) into one consistent shape.
export function normalizeOpportunity(o) {
  if (!o) return null;
  return {
    id: o.id,
    title: o.title || "Untitled opportunity",
    organization: o.organization || "",
    organization_id: o.organization_id || null,
    description: o.description || "",
    image_url: o.image_url || "",
    cause: o.cause || "Community",
    causes: Array.isArray(o.causes) && o.causes.length ? o.causes : [o.cause].filter(Boolean),
    location: o.location || "",
    city: o.city || "",
    state: o.state || "",
    neighborhood: o.neighborhood || "",
    format: o.format || "in-person",
    date: o.date || "",
    start_time: o.start_time || "",
    end_time: o.end_time || "",
    time_commitment: o.time_commitment || "",
    recurring: !!o.recurring,
    opportunity_type: o.opportunity_type || "One-time",
    age_requirement: o.age_requirement || "All ages",
    skills: Array.isArray(o.skills) ? o.skills : [],
    physical_activity: o.physical_activity || "Light",
    tags: Array.isArray(o.tags) ? o.tags : [],
    distance_km: o.distance_km ?? null,
    spots_total: o.spots_total ?? null,
    spots_filled: o.spots_filled ?? 0,
    impact_unit: o.impact_unit || "",
    impact_value: o.impact_value ?? null,
    contact: o.contact || "",
    status: o.status || "open",
  };
}

export const opportunityService = {
  async list() {
    try {
      const items = await base44.entities.Opportunity.list("-created_date", 100);
      const normalized = (items || []).map(normalizeOpportunity).filter(Boolean);
      return normalized.length ? normalized : MOCK_OPPORTUNITIES.map(normalizeOpportunity);
    } catch {
      return MOCK_OPPORTUNITIES.map(normalizeOpportunity);
    }
  },

  async get(id) {
    if (!id) return null;
    try {
      const o = await base44.entities.Opportunity.get(id);
      if (o) return normalizeOpportunity(o);
    } catch {
      /* fall through to mock */
    }
    const found = MOCK_OPPORTUNITIES.find((o) => o.id === id);
    return found ? normalizeOpportunity(found) : null;
  },

  async featured(limit = 6) {
    const all = await this.list();
    return all.slice(0, limit);
  },

  async getByOrganization(orgId) {
    if (!orgId) return [];
    const all = await this.list();
    return all.filter((o) => o.organization_id === orgId);
  },

  // Demo-aware: true when the record came from mock data.
  isDemo(opp) {
    return !!opp && typeof opp.id === "string" && opp.id.startsWith("demo-");
  },

  async create(data) {
    const o = await base44.entities.Opportunity.create({
      spots_filled: 0,
      status: "open",
      format: "in-person",
      ...data,
    });
    return normalizeOpportunity(o);
  },

  async update(id, data) {
    const o = await base44.entities.Opportunity.update(id, data);
    return normalizeOpportunity(o);
  },

  async remove(id) {
    return base44.entities.Opportunity.delete(id);
  },
};