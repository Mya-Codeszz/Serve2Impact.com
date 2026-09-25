import { useEffect, useState, useCallback } from "react";
import { savedOpportunityService } from "@/services/savedOpportunities";

// Shared hook for saved-opportunity state. Keeps every card, page, and the
// Saved list in sync across the app. Swap the service during migration; the
// hook's interface stays the same.
export function useSavedOpportunities() {
  const [savedIds, setSavedIds] = useState(() => savedOpportunityService.getSavedIds());

  useEffect(() => {
    const unsub = savedOpportunityService.subscribe(setSavedIds);
    setSavedIds(savedOpportunityService.getSavedIds());
    return unsub;
  }, []);

  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds]);

  const toggle = useCallback((id) => {
    savedOpportunityService.toggle(id);
    setSavedIds(savedOpportunityService.getSavedIds());
  }, []);

  return { savedIds, isSaved, toggle };
}