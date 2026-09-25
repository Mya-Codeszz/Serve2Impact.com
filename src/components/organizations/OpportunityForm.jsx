import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, Send, X } from "lucide-react";
import {
  CAUSES,
  CAUSE_EMOJI,
  FORMATS,
  FORMAT_LABEL,
  AGE_OPTIONS,
  SKILL_OPTIONS,
  PHYSICAL_OPTIONS,
  OPPORTUNITY_TYPES,
} from "@/lib/s2i-data";

// Full opportunity creation/edit form for organizations.
// Supports Save Draft, Preview, and Publish — all frontend/demo for now.
// The form value shape matches the normalized Opportunity (see services/opportunities.js).

const blank = {
  title: "", organization: "", description: "", image_url: "",
  cause: "Community", causes: [], location: "", city: "", state: "", neighborhood: "",
  format: "in-person", date: "", start_time: "", end_time: "",
  time_commitment: "", recurring: false, opportunity_type: "One-time",
  age_requirement: "All ages", skills: [], physical_activity: "Light",
  tags: [], spots_total: 10, impact_unit: "", impact_value: 0,
  contact: "",
};

export default function OpportunityForm({ initial, onSave, onPublish, onCancel }) {
  const [form, setForm] = useState({ ...blank, ...initial });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setNum = (k) => (e) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }));
  const toggleSkill = (s) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(s) ? f.skills.filter((x) => x !== s) : [...f.skills, s],
    }));

  const doSave = (publish = false) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (publish) onPublish(form);
      else onSave(form);
    }, 500);
  };

  if (preview) {
    return (
      <div className="paper rounded-2xl border border-border/70 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-primary">Preview</h3>
          <button onClick={() => setPreview(false)} className="text-sm font-semibold text-accent hover:underline">
            ← Back to edit
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary">
              {CAUSE_EMOJI[form.cause]} {form.cause}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary">
              {FORMAT_LABEL[form.format] || form.format}
            </span>
            {form.recurring && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary">Recurring</span>}
          </div>
          <h2 className="text-2xl font-extrabold text-primary">{form.title || "Untitled opportunity"}</h2>
          <p className="text-sm font-semibold text-accent">{form.organization || "—"}</p>
          <div className="grid grid-cols-1 gap-1.5 text-sm text-foreground/80">
            <p>📍 {form.location || "—"}</p>
            <p>🗓️ {form.date || "—"}</p>
            <p>⏰ {form.start_time}{form.end_time ? ` – ${form.end_time}` : ""}</p>
            {form.time_commitment && <p>⏳ {form.time_commitment}</p>}
            <p>👥 Age: {form.age_requirement}</p>
            <p>💪 Activity: {form.physical_activity}</p>
            {form.skills.length > 0 && <p>✨ {form.skills.join(", ")}</p>}
          </div>
          {form.description && <p className="text-foreground/75 leading-relaxed">{form.description}</p>}
          <div className="paper rounded-xl border border-border/70 p-3 flex items-center justify-between">
            <span className="text-sm">Spots: {form.spots_total}</span>
            {form.impact_value > 0 && (
              <span className="font-hand text-lg text-accent">≈ {form.impact_value} {form.impact_unit}</span>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={() => setPreview(false)}>Back to edit</Button>
          <Button onClick={() => doSave(true)} className="btn-grass" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
            Publish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); doSave(false); }}
      className="paper rounded-2xl border border-border/70 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-primary text-lg">Opportunity details</h3>
        <button type="button" onClick={onCancel} className="p-1.5 text-foreground/50 hover:text-primary" aria-label="Close form">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-title">Title <span className="text-destructive">*</span></Label>
        <Input id="of-title" value={form.title} onChange={set("title")} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-org">Organization</Label>
          <Input id="of-org" value={form.organization} onChange={set("organization")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-cause">Cause</Label>
          <select id="of-cause" value={form.cause} onChange={set("cause")}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {CAUSES.map((c) => <option key={c} value={c}>{CAUSE_EMOJI[c]} {c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-desc">Description</Label>
        <Textarea id="of-desc" rows={3} value={form.description} onChange={set("description")} placeholder="What will volunteers do?" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-loc">Location <span className="text-destructive">*</span></Label>
        <Input id="of-loc" value={form.location} onChange={set("location")} required placeholder="e.g. Downtown Riverside, CA" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-city">City</Label>
          <Input id="of-city" value={form.city} onChange={set("city")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-state">State</Label>
          <Input id="of-state" value={form.state} onChange={set("state")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-format">Format</Label>
          <select id="of-format" value={form.format} onChange={set("format")}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {FORMATS.map((f) => <option key={f} value={f}>{FORMAT_LABEL[f]}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-date">Date</Label>
          <Input id="of-date" type="date" value={form.date ? form.date.slice(0, 10) : ""} onChange={set("date")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-start">Start time</Label>
          <Input id="of-start" value={form.start_time} onChange={set("start_time")} placeholder="09:00" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-end">End time</Label>
          <Input id="of-end" value={form.end_time} onChange={set("end_time")} placeholder="12:00" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-tc">Time commitment</Label>
          <Input id="of-tc" value={form.time_commitment} onChange={set("time_commitment")} placeholder="e.g. 3 hours" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-type">Opportunity type</Label>
          <select id="of-type" value={form.opportunity_type} onChange={set("opportunity_type")}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-age">Age requirement</Label>
          <select id="of-age" value={form.age_requirement} onChange={set("age_requirement")}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {AGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-phys">Physical activity</Label>
          <select id="of-phys" value={form.physical_activity} onChange={set("physical_activity")}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {PHYSICAL_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Skills / good for</Label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSkill(s)}
              aria-pressed={form.skills.includes(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                form.skills.includes(s) ? "bg-accent text-white border-accent" : "bg-card border-border hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="of-recur"
          type="checkbox"
          checked={form.recurring}
          onChange={(e) => setForm((f) => ({ ...f, recurring: e.target.checked }))}
          className="w-4 h-4 rounded border-border"
        />
        <Label htmlFor="of-recur" className="cursor-pointer">Recurring opportunity</Label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="of-spots">Capacity (spots)</Label>
          <Input id="of-spots" type="number" min="1" value={form.spots_total} onChange={setNum("spots_total")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-iv">Impact value</Label>
          <Input id="of-iv" type="number" min="0" value={form.impact_value} onChange={setNum("impact_value")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-iu">Impact unit</Label>
          <Input id="of-iu" value={form.impact_unit} onChange={set("impact_unit")} placeholder="e.g. meals packed" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-contact">Contact info for volunteers</Label>
        <Input id="of-contact" value={form.contact} onChange={set("contact")} placeholder="email or phone" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-img">Image URL (optional)</Label>
        <Input id="of-img" value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="outline" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Save draft
        </Button>
        <Button type="button" variant="outline" onClick={() => setPreview(true)}>
          <Eye className="w-4 h-4 mr-1" /> Preview
        </Button>
        <Button type="button" onClick={() => doSave(true)} className="btn-grass" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
          Publish
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}