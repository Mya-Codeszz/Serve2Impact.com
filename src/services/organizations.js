// Organizations data-access service. Same migration pattern as opportunities.

import { base44 } from "@/api/base44Client";
import { MOCK_ORGANIZATIONS } from "@/data/mock";

export function normalizeOrganization(o) {
  if (!o) return null;
  return {
    id: o.id,
    name: o.name || "Organization",
    about: o.about || "",
    location: o.location || "",
    cause: o.cause || "Community",
    image_url: o.image_url || "",
    website: o.website || "",
  };
}

export const organizationService = {
  async list() {
    try {
      const items = await base44.entities.Organization.list("-created_date", 100);
      const normalized = (items || []).map(normalizeOrganization).filter(Boolean);
      return normalized.length ? normalized : MOCK_ORGANIZATIONS.map(normalizeOrganization);
    } catch {
      return MOCK_ORGANIZATIONS.map(normalizeOrganization);
    }
  },

  async get(id) {
    if (!id) return null;
    try {
      const o = await base44.entities.Organization.get(id);
      if (o) return normalizeOrganization(o);
    } catch {
      /* fall through */
    }
    const found = MOCK_ORGANIZATIONS.find((o) => o.id === id);
    return found ? normalizeOrganization(found) : null;
  },

  isDemo(org) {
    return !!org && typeof org.id === "string" && org.id.startsWith("demo-");
  },
};