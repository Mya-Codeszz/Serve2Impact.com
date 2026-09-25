// Saved opportunities service.
//
// Today this is frontend-only (localStorage) — there is no SavedOpportunity
// entity yet. The interface is intentionally identical to a future DB-backed
// service, so migration is a drop-in replacement.

const KEY = "s2i:saved-opp-ids";
const EVENT = "s2i:saved-change";

function readIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeIds(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    // Cross-tab + same-tab notification.
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore quota / privacy mode */
  }
}

export const savedOpportunityService = {
  getSavedIds() {
    return readIds();
  },

  isSaved(id) {
    return readIds().includes(id);
  },

  save(id) {
    const ids = readIds();
    if (!ids.includes(id)) {
      ids.unshift(id);
      writeIds(ids);
    }
    return ids;
  },

  unsave(id) {
    writeIds(readIds().filter((x) => x !== id));
    return readIds();
  },

  toggle(id) {
    return this.isSaved(id) ? this.unsave(id) : this.save(id);
  },

  // Resolve saved ids into full opportunity objects via a provided list.
  resolveSaved(allOpportunities) {
    const ids = readIds();
    return ids
      .map((id) => allOpportunities.find((o) => o.id === id))
      .filter(Boolean);
  },

  // Subscribe to saves changes (cross-tab + same-tab).
  subscribe(cb) {
    const handler = () => cb(readIds());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};