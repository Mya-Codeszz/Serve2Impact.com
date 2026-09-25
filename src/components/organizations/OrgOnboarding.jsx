import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Asset from "@/components/Asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CAUSES, CAUSE_EMOJI } from "@/lib/s2i-data";

// Multi-step organization onboarding flow (frontend-only demo).
// Step 1: Org info → Step 2: Causes → Step 3: Opportunities → Step 4: Review → Step 5: Pending
// No real verification backend — the pending state is simulated.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OrgOnboarding() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", about: "", website: "", location: "", contactName: "", contactEmail: "",
    causes: [],
    oppTitle: "", oppDesc: "", oppCause: "", oppLocation: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const toggleCause = (c) => {
    setForm((f) => ({
      ...f,
      causes: f.causes.includes(c) ? f.causes.filter((x) => x !== c) : [...f.causes, c],
    }));
  };

  const validateStep = (s) => {
    const er = {};
    if (s === 0) {
      if (!form.name.trim()) er.name = "Organization name is required.";
      if (!form.location.trim()) er.location = "Where are you based?";
      if (!form.contactName.trim()) er.contactName = "Who should we contact?";
      if (!form.contactEmail.trim()) er.contactEmail = "We need an email.";
      else if (!EMAIL_RE.test(form.contactEmail)) er.contactEmail = "That doesn't look like a valid email.";
      if (form.website && !/^https?:\/\/.+\..+/.test(form.website)) er.website = "Include the full URL.";
    }
    if (s === 1 && form.causes.length === 0) er.causes = "Pick at least one cause.";
    return er;
  };

  const next = () => {
    const er = validateStep(step);
    setErrors(er);
    if (Object.keys(er).length) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const submit = () => {
    setSaving(true);
    // Simulate a brief submit, then show pending state
    setTimeout(() => {
      setSaving(false);
      setStep(4);
    }, 800);
  };

  const steps = ["Organization", "Causes", "Opportunities", "Review", "Pending"];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {steps.slice(0, 4).map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < step ? "bg-accent text-white" : i === step ? "bg-accent text-white" : "bg-secondary text-foreground/50"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === step ? "text-primary" : "text-foreground/50"}`}>{label}</span>
            </div>
            {i < 3 && <div className="w-4 h-px bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Organization info */}
      {step === 0 && (
        <div className="paper rounded-2xl border border-border/70 p-6 space-y-4">
          <div>
            <h2 className="font-hand text-2xl text-primary">Tell us about your organization</h2>
            <p className="text-sm text-foreground/60 mt-0.5">Basic info so students can find you.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-name">Organization name <span className="text-destructive">*</span></Label>
            <Input id="ob-name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-about">Description</Label>
            <Textarea id="ob-about" rows={3} value={form.about} onChange={set("about")} placeholder="What does your organization do?" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ob-website">Website</Label>
              <Input id="ob-website" value={form.website} onChange={set("website")} placeholder="https://..." aria-invalid={!!errors.website} />
              {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-loc">Location <span className="text-destructive">*</span></Label>
              <Input id="ob-loc" value={form.location} onChange={set("location")} aria-invalid={!!errors.location} />
              {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ob-contact">Contact name <span className="text-destructive">*</span></Label>
              <Input id="ob-contact" value={form.contactName} onChange={set("contactName")} aria-invalid={!!errors.contactName} />
              {errors.contactName && <p className="text-xs text-destructive">{errors.contactName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-email">Contact email <span className="text-destructive">*</span></Label>
              <Input id="ob-email" type="email" value={form.contactEmail} onChange={set("contactEmail")} aria-invalid={!!errors.contactEmail} />
              {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail}</p>}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={next} className="btn-grass">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Causes */}
      {step === 1 && (
        <div className="paper rounded-2xl border border-border/70 p-6 space-y-4">
          <div>
            <h2 className="font-hand text-2xl text-primary">What causes do you serve?</h2>
            <p className="text-sm text-foreground/60 mt-0.5">Pick all that apply — students search by cause.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CAUSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCause(c)}
                aria-pressed={form.causes.includes(c)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  form.causes.includes(c) ? "btn-grass border-accent" : "bg-card border-border hover:border-accent"
                }`}
              >
                {CAUSE_EMOJI[c]} {c}
              </button>
            ))}
          </div>
          {errors.causes && <p className="text-xs text-destructive">{errors.causes}</p>}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="btn-grass">
              Next <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Opportunities (optional) */}
      {step === 2 && (
        <div className="paper rounded-2xl border border-border/70 p-6 space-y-4">
          <div>
            <h2 className="font-hand text-2xl text-primary">Add your first opportunity</h2>
            <p className="text-sm text-foreground/60 mt-0.5">Optional — you can add more later from your dashboard.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-opp-title">Opportunity title</Label>
            <Input id="ob-opp-title" value={form.oppTitle} onChange={set("oppTitle")} placeholder="e.g. Saturday Meal Pack" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-opp-desc">Description</Label>
            <Textarea id="ob-opp-desc" rows={3} value={form.oppDesc} onChange={set("oppDesc")} placeholder="What will volunteers do?" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ob-opp-cause">Cause</Label>
              <select
                id="ob-opp-cause"
                value={form.oppCause}
                onChange={set("oppCause")}
                className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="">Select a cause</option>
                {CAUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-opp-loc">Location</Label>
              <Input id="ob-opp-loc" value={form.oppLocation} onChange={set("oppLocation")} placeholder="e.g. Downtown Riverside, CA" />
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="btn-grass">
              Review <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="paper rounded-2xl border border-border/70 p-6 space-y-4">
          <div>
            <h2 className="font-hand text-2xl text-primary">Review your details</h2>
            <p className="text-sm text-foreground/60 mt-0.5">Make sure everything looks right before submitting.</p>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="dashed-rule pb-2">
              <dt className="text-foreground/60">Organization</dt>
              <dd className="font-semibold text-primary">{form.name || "—"}</dd>
            </div>
            <div className="dashed-rule pb-2">
              <dt className="text-foreground/60">Location</dt>
              <dd className="font-semibold text-primary">{form.location || "—"}</dd>
            </div>
            <div className="dashed-rule pb-2">
              <dt className="text-foreground/60">Causes</dt>
              <dd className="font-semibold text-primary">
                {form.causes.length ? form.causes.map((c) => `${CAUSE_EMOJI[c]} ${c}`).join(", ") : "—"}
              </dd>
            </div>
            <div className="dashed-rule pb-2">
              <dt className="text-foreground/60">Contact</dt>
              <dd className="font-semibold text-primary">{form.contactName || "—"} · {form.contactEmail || "—"}</dd>
            </div>
            {form.oppTitle && (
              <div className="dashed-rule pb-2">
                <dt className="text-foreground/60">First opportunity</dt>
                <dd className="font-semibold text-primary">{form.oppTitle}</dd>
              </div>
            )}
          </dl>
          <p className="text-xs text-foreground/50">
            Demo flow — your organization will need to be reviewed before publishing opportunities.
          </p>
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button onClick={submit} className="btn-grass" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit for review
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Pending */}
      {step === 4 && (
        <div className="paper rounded-2xl border border-border/70 p-8 text-center max-w-md mx-auto">
          <Asset name="earth.png" alt="" width={80} className="mx-auto mb-4" />
          <h2 className="font-hand text-3xl text-primary">Verification pending</h2>
          <p className="text-foreground/70 mt-3">
            Thanks, {form.contactName?.split(" ")[0] || "there"}! We received your organization details.
          </p>
          <p className="text-foreground/70 mt-2">
            Your organization will need to be reviewed before you can publish opportunities. We'll reach out
            to {form.contactEmail || "you"} once that's done.
          </p>
          <p className="text-xs text-foreground/50 mt-3">
            This is a demo flow — no real verification is happening yet.
          </p>
          <div className="flex flex-col items-center gap-3 mt-6">
            <Link to="/org-dashboard" className="btn-grass px-5 py-2.5 rounded-lg">
              Preview your dashboard
            </Link>
            <Link to="/" className="text-sm font-semibold text-accent hover:underline">Back to home</Link>
          </div>
        </div>
      )}
    </div>
  );
}