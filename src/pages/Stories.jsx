import React, { useState } from "react";
import Asset from "@/components/Asset";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const PASTELS = ["#dcfce7", "#dbeafe", "#fce7f3", "#fef9c3", "#ede9fe", "#ffedd5"];

const STORIES = [
  {
    name: "Maya R.", school: "Roosevelt High", grade: "11th grade",
    org: "Bayview Food Pantry", opportunity: "Meal Packing", hours: 24,
    excerpt: "I showed up nervous, not knowing anyone. Three hours later I'd packed 200 meals and met the kindest crew. Now I go every Saturday.",
    full: "I showed up nervous, not knowing anyone. Three hours later I'd packed 200 meals and met the kindest crew. What surprised me most was how fast the time went — you're moving, laughing, and suddenly the whole shift is done. Now I go every Saturday, and I've started bringing my little brother too. Serve2Impact made it easy to find something close to home that actually matters.",
  },
  {
    name: "Devin K.", school: "Lincoln Prep", grade: "12th grade",
    org: "Greenway Conservancy", opportunity: "Creek Cleanup", hours: 18,
    excerpt: "It finally feels like my hours actually count for something. I can see exactly what I gave back — 14 bags of trash, 3 weekends.",
    full: "It finally feels like my hours actually count for something. I can see exactly what I gave back — 14 bags of trash pulled from the creek over 3 weekends. My counselor asked for a record of my service and I just downloaded my impact receipt. That used to be a scramble; now it's one click.",
  },
  {
    name: "Priya S.", school: "Westfield Academy", grade: "10th grade",
    org: "Sunrise Tutoring", opportunity: "Reading Buddy", hours: 30,
    excerpt: "Found a tutoring opportunity ten minutes from my house. Now my whole crew goes every week and we track our hours together.",
    full: "Found a tutoring opportunity ten minutes from my house. Now my whole crew goes every week and we track our hours together. The best part is watching my reading buddy go from sounding out letters to reading whole sentences. That's the part nobody told me about — it's not about the hours, it's about one kid.",
  },
];

const PARTNER_ORGS = ["Bayview Food Pantry", "Greenway Conservancy", "Sunrise Tutoring"];
// All stories and organizations above are fictional demo content.

function StoryCard({ s, i }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className="rounded-2xl border border-border/70 p-5 flex flex-col"
      style={{ backgroundColor: PASTELS[i % PASTELS.length] }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="font-bold text-primary">{s.name}</p>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-card/70 text-primary">{s.grade}</span>
      </div>
      <p className="text-xs text-foreground/70 mb-3">{s.school}</p>
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        <span className="px-2 py-1 rounded-full bg-card/70">🏫 {s.org}</span>
        <span className="px-2 py-1 rounded-full bg-card/70">🤝 {s.opportunity}</span>
        <span className="px-2 py-1 rounded-full bg-card/70 font-semibold">⏱️ {s.hours} hrs</span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">{open ? s.full : s.excerpt}</p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="self-start mt-3 text-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        {open ? "Show less" : "Read story →"}
      </button>
    </article>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Stories() {
  const [form, setForm] = useState({ name: "", school: "", email: "", org: "", did: "", story: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Please tell us your name.";
    if (!form.school.trim()) er.school = "Which school do you attend?";
    if (!form.email.trim()) er.email = "We need an email to follow up.";
    else if (!EMAIL_RE.test(form.email)) er.email = "That doesn't look like a valid email.";
    if (!form.org.trim()) er.org = "Which organization did you volunteer with?";
    if (!form.did.trim()) er.did = "Tell us what you did.";
    if (!form.story.trim() || form.story.trim().length < 20) er.story = "A few sentences, please (20+ characters).";
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("submitting");
    // Frontend-only preview: simulate a brief submit, then show success.
    setTimeout(() => setStatus("success"), 700);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Stories from the crew</h1>
        <p className="mt-2 text-foreground/70 max-w-lg mx-auto">
          Sample stories — demo content shown to illustrate what showing up looks like.
        </p>
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-0 right-4 rotate-pos-4 hidden sm:block" />
      </div>

      {/* Featured stories — pastel cards, no image areas */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {STORIES.map((s, i) => <StoryCard key={s.name} s={s} i={i} />)}
      </section>

      {/* Partner organizations — named, verifiable (from the stories above) */}
      <section className="mb-16">
        <p className="text-center text-sm text-foreground/60 mb-4">Organizations students have volunteered with</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {PARTNER_ORGS.map((o) => (
            <span key={o} className="font-hand text-xl text-primary">{o}</span>
          ))}
        </div>
      </section>

      {/* Testimonials — quotes only, no photos */}
      <Testimonials />

      {/* Story submission form */}
      <section className="mt-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Share your story</h2>
          <p className="text-foreground/70 mt-1">We'd love to hear how showing up went for you.</p>
        </div>

        {status === "success" ? (
          <div className="paper rounded-2xl border border-border/70 p-8 text-center max-w-xl mx-auto">
            <Asset name="check.png" alt="" width={60} className="mx-auto mb-3" />
            <h3 className="font-hand text-2xl text-primary">Thank you!</h3>
            <p className="text-foreground/70 mt-2">
              Your story has been submitted for review.
            </p>
            <p className="text-xs text-foreground/50 mt-2">
              (This is a preview form — submissions aren't stored yet.)
            </p>
            <Button className="btn-grass mt-5" onClick={() => { setStatus("idle"); setForm({ name: "", school: "", email: "", org: "", did: "", story: "" }); }}>
              Share another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="paper rounded-2xl border border-border/70 p-6 max-w-xl mx-auto space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Name <span className="text-destructive">*</span></Label>
                <Input id="s-name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-school">School <span className="text-destructive">*</span></Label>
                <Input id="s-school" value={form.school} onChange={set("school")} aria-invalid={!!errors.school} />
                {errors.school && <p className="text-xs text-destructive">{errors.school}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-email">Email <span className="text-destructive">*</span></Label>
                <Input id="s-email" type="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-org">Organization you volunteered with <span className="text-destructive">*</span></Label>
                <Input id="s-org" value={form.org} onChange={set("org")} aria-invalid={!!errors.org} />
                {errors.org && <p className="text-xs text-destructive">{errors.org}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-did">What did you do? <span className="text-destructive">*</span></Label>
              <Input id="s-did" value={form.did} onChange={set("did")} placeholder="e.g. Packed meals, cleaned a creek..." aria-invalid={!!errors.did} />
              {errors.did && <p className="text-xs text-destructive">{errors.did}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-story">Your story <span className="text-destructive">*</span></Label>
              <Textarea id="s-story" rows={5} value={form.story} onChange={set("story")} aria-invalid={!!errors.story} />
              {errors.story && <p className="text-xs text-destructive">{errors.story}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-photo">Optional photo</Label>
              <Input id="s-photo" type="file" accept="image/*" className="h-12" />
              <p className="text-xs text-foreground/50">A photo of the work (not of people) is welcome but not required.</p>
            </div>
            <Button type="submit" className="btn-grass w-full h-12" disabled={status === "submitting"}>
              {status === "submitting" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit story
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}