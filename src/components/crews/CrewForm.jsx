import React, { useState } from "react";
import { CAUSES, CAUSE_EMOJI } from "@/lib/s2i-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

// Frontend-only crew creation form. Returns a demo crew object via onCreate.
// There is no production crew backend yet — the crew exists in local state only.
export default function CrewForm({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cause, setCause] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give your crew a name!");
      return;
    }
    setSaving(true);
    // Simulate a brief save so the UI feels responsive
    setTimeout(() => {
      setSaving(false);
      onCreate({ name: name.trim(), description: description.trim(), cause });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative paper rounded-2xl border border-border/70 p-6 w-full max-w-md space-y-4 bg-card shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-foreground/50 hover:text-primary rounded-md"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-hand text-2xl text-primary">Start a crew</h2>
          <p className="text-sm text-foreground/60 mt-0.5">
            Grab your friends and volunteer together. (Demo — saved on this device for now.)
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="crew-name">Crew name <span className="text-destructive">*</span></Label>
          <Input
            id="crew-name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. The Saturday Crew"
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="crew-desc">Description</Label>
          <Textarea
            id="crew-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's your crew about?"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="crew-cause">Cause (optional)</Label>
          <select
            id="crew-cause"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">No specific cause</option>
            {CAUSES.map((c) => (
              <option key={c} value={c}>{CAUSE_EMOJI[c]} {c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="submit" className="btn-grass flex-1" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create crew
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}