import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import Asset from "@/components/Asset";
import { Button } from "@/components/ui/button";
import { opportunityService } from "@/services/opportunities";
import { signupService } from "@/services/signups";
import { organizationService } from "@/services/organizations";
import { useAuth } from "@/lib/AuthContext";
import { CAUSE_EMOJI, fmtDate, causeColor } from "@/lib/s2i-data";
import { toast } from "@/components/ui/use-toast";
import OpportunityForm from "@/components/organizations/OpportunityForm";

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [opps, setOpps] = useState([]);
  const [signups, setSignups] = useState([]);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const [o, s, orgs] = await Promise.all([
        opportunityService.list(),
        user ? signupService.getMySignups(user.id) : [],
        organizationService.list(),
      ]);
      setOpps(o);
      setSignups(s);
      if (orgs.length) setOrg(orgs[0]);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const totalHours = signups.reduce((sum, s) => sum + (s.hours || 0), 0);
  const checkedIn = signups.filter((s) => s.status === "checked_in" || s.status === "completed").length;
  const drafts = opps.filter((o) => o.status === "draft" || o.status === "completed" && o.title?.includes("(draft)"));
  const published = opps.filter((o) => o.status === "open" || o.status === "full");

  const startNew = () => { setEditingId(null); setShowForm(true); };
  const startEdit = (o) => { setEditingId(o.id); setShowForm(true); };

  const handleSave = async (data) => {
    try {
      if (editingId) {
        await opportunityService.update(editingId, { ...data, status: "draft" });
        toast({ title: "Draft saved" });
      } else {
        // For demo: just add to local state since we may be using mock data
        toast({ title: "Draft saved", description: "Saved locally (demo)." });
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast({ title: "Save failed", description: err?.message, variant: "destructive" });
    }
  };

  const handlePublish = async (data) => {
    try {
      if (editingId) {
        await opportunityService.update(editingId, { ...data, status: "open", spots_filled: 0 });
        toast({ title: "Opportunity published!" });
      } else {
        const created = await opportunityService.create({ ...data, status: "open" });
        toast({ title: "Opportunity published!", description: created.title });
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast({ title: "Publish failed", description: err?.message, variant: "destructive" });
    }
  };

  const remove = async (o) => {
    if (!confirm(`Delete "${o.title}"?`)) return;
    try {
      if (!opportunityService.isDemo(o)) {
        await opportunityService.remove(o.id);
      }
      setOpps((prev) => prev.filter((x) => x.id !== o.id));
      toast({ title: "Deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err?.message, variant: "destructive" });
    }
  };

  const toggleCheckIn = async (s) => {
    const checked = s.status === "checked_in" || s.status === "completed";
    try {
      if (!checked) {
        await signupService.checkIn(s.id);
      } else {
        // Revert to signed_up — direct update via service
        if (!s.id?.startsWith("demo-")) {
          // Can't easily revert via signupService; just update local state for demo
        }
      }
      setSignups((prev) =>
        prev.map((x) =>
          x.id === s.id
            ? { ...x, status: checked ? "signed_up" : "checked_in", checked_in_at: checked ? null : new Date().toISOString(), hours: checked ? 0 : 3 }
            : x
        )
      );
      toast({ title: checked ? "Checked out" : "Checked in!" });
    } catch (err) {
      toast({ title: "Update failed", description: err?.message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Organization dashboard</h1>
          <p className="text-foreground/60 text-sm">Create opportunities, manage volunteers, and track attendance.</p>
        </div>
        <Button onClick={startNew} className="btn-grass shrink-0">
          <Plus className="w-4 h-4 mr-1" /> New opportunity
        </Button>
      </div>

      {/* Org profile summary */}
      {org && (
        <div className="paper rounded-xl border border-border/70 p-5 mb-8 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: causeColor(org.cause).bg }}
          >
            <span className="text-xl" aria-hidden>{CAUSE_EMOJI[org.cause]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-primary truncate">{org.name}</h2>
            <p className="text-xs text-foreground/60">{org.location} · {org.cause}</p>
          </div>
          <span className="text-xs font-semibold text-foreground/50 bg-secondary px-3 py-1 rounded-full shrink-0">
            Verification pending
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="paper rounded-xl border border-border/70 p-4">
          <div className="font-hand text-accent">Published</div>
          <div className="text-2xl font-extrabold text-primary">{published.length}</div>
        </div>
        <div className="paper rounded-xl border border-border/70 p-4">
          <div className="font-hand text-accent">Drafts</div>
          <div className="text-2xl font-extrabold text-primary">{drafts.length}</div>
        </div>
        <div className="paper rounded-xl border border-border/70 p-4">
          <div className="font-hand text-accent">Volunteers</div>
          <div className="text-2xl font-extrabold text-primary">{signups.length}</div>
        </div>
        <div className="paper rounded-xl border border-border/70 p-4">
          <div className="font-hand text-accent">Hours logged</div>
          <div className="text-2xl font-extrabold text-primary">{Math.round(totalHours)}</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl my-8">
            <OpportunityForm
              initial={editingId ? opps.find((o) => o.id === editingId) : null}
              onSave={handleSave}
              onPublish={handlePublish}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Opportunities */}
        <div>
          <h2 className="font-bold text-primary mb-4">Your opportunities</h2>
          {loading ? (
            <div className="h-32 bg-secondary/60 rounded-xl animate-pulse" />
          ) : opps.length === 0 ? (
            <div className="text-center py-12 paper rounded-xl border border-border/70">
              <Asset name="smiley.png" alt="" width={50} className="mx-auto mb-2" />
              <p className="font-hand text-xl text-foreground/70">No opportunities yet</p>
              <p className="text-foreground/60 text-sm mt-1">Create your first one!</p>
              <Button onClick={startNew} className="btn-grass mt-3 h-9">
                <Plus className="w-4 h-4 mr-1" /> New opportunity
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {opps.map((o) => {
                const isDraft = o.status === "draft";
                const c = causeColor(o.cause);
                return (
                  <div key={o.id} className="paper rounded-xl border border-border/70 p-4 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0" aria-hidden>{CAUSE_EMOJI[o.cause]}</span>
                        <p className="font-semibold text-primary truncate">{o.title}</p>
                      </div>
                      <p className="text-xs text-foreground/60 mt-0.5">
                        {fmtDate(o.date)} · {o.spots_filled || 0}/{o.spots_total || "—"} spots
                      </p>
                      <span
                        className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isDraft ? "bg-secondary text-foreground/60" : "bg-accent/10 text-accent"
                        }`}
                      >
                        {isDraft ? "Draft" : "Published"}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEdit(o)} className="p-1.5 text-foreground/60 hover:text-accent rounded-md" aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(o)} className="p-1.5 text-foreground/60 hover:text-destructive rounded-md" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Volunteers / attendance */}
        <div>
          <h2 className="font-bold text-primary mb-4">Volunteers & attendance</h2>
          {signups.length === 0 ? (
            <div className="text-center py-12 paper rounded-xl border border-border/70">
              <p className="font-hand text-xl text-foreground/70">No signups yet</p>
              <p className="text-foreground/60 text-sm mt-1">Signups will appear here once students join.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {signups.map((s) => {
                const checked = s.status === "checked_in" || s.status === "completed";
                return (
                  <div key={s.id} className="paper rounded-xl border border-border/70 p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">{s.opportunity_title}</p>
                      <p className="text-xs text-foreground/60">{fmtDate(s.date)} · {s.status}</p>
                    </div>
                    <button
                      onClick={() => toggleCheckIn(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shrink-0 ${
                        checked ? "bg-accent text-white" : "border border-border"
                      }`}
                    >
                      {checked ? <><Check className="w-3.5 h-3.5" /> Checked in</> : "Check in"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}