import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Asset from "@/components/Asset";
import { userService } from "@/services/users";
import { opportunityService } from "@/services/opportunities";
import { useAuth } from "@/lib/AuthContext";
import { CAUSES, CAUSE_EMOJI } from "@/lib/s2i-data";
import { toast } from "@/components/ui/use-toast";

// Conversational 60-second onboarding. Uses the service layer so the data
// source can be swapped without touching this page.
export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState([]);
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("Weekdays");
  const [saving, setSaving] = useState(false);
  const [opps, setOpps] = useState([]);

  useEffect(() => {
    if (user) {
      if (Array.isArray(user.interests)) setInterests(user.interests);
      if (user.location) setLocation(user.location);
      if (user.availability) setAvailability(user.availability);
    }
  }, [user]);

  const toggle = (c) =>
    setInterests((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const finish = async () => {
    setSaving(true);
    try {
      if (user) {
        await userService.updateMe({ interests, location, availability, onboarded: true });
      }
      const list = await opportunityService.list();
      const loc = location.trim().toLowerCase();
      const matched = list
        .filter((o) => interests.length === 0 || interests.includes(o.cause) || (o.causes || []).some((c) => interests.includes(c)))
        .sort((a, b) => {
          const aLoc = loc && (a.location || "").toLowerCase().includes(loc) ? 0 : 1;
          const bLoc = loc && (b.location || "").toLowerCase().includes(loc) ? 0 : 1;
          return aLoc - bLoc;
        })
        .slice(0, 3);
      setOpps(matched.length ? matched : list.slice(0, 3));
      setStep(4);
    } catch (e) {
      toast({ title: "Something went wrong", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const progress = 20 + step * 20;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/90 backdrop-blur-sm border-b border-border/60 mb-8">
        <div className="flex justify-between text-xs text-foreground/60 mb-1">
          <span>Getting set up · Step {Math.min(step + 1, 4)} of 4</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="text-center">
          <Asset name="earth.png" alt="" width={90} className="mx-auto mb-4" />
          <h1 className="font-hand text-3xl text-primary">Hey there! 👋</h1>
          <p className="text-foreground/70 mt-2 mb-6">
            Let's find you something meaningful in about a minute. We've already given you a head start — see the bar above?
          </p>
          <button onClick={() => setStep(1)} className="btn-grass px-6 py-3 rounded-lg">Let's go</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-hand text-2xl text-primary mb-1">What do you care about?</h2>
          <p className="text-foreground/60 text-sm mb-4">Pick a few causes — we'll match you to opportunities.</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {CAUSES.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                aria-pressed={interests.includes(c)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  interests.includes(c) ? "btn-grass border-accent" : "bg-card border-border hover:border-accent"
                }`}
              >
                {CAUSE_EMOJI[c]} {c}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={interests.length === 0} className="btn-grass px-6 py-3 rounded-lg disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-hand text-2xl text-primary mb-1">Where are you?</h2>
          <p className="text-foreground/60 text-sm mb-4">City or neighborhood — we'll find things nearby.</p>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Riverside, CA"
            aria-label="Your location"
            className="w-full h-12 rounded-lg border border-border bg-card px-4 mb-6 outline-none focus:border-accent"
          />
          <button onClick={() => setStep(3)} disabled={!location} className="btn-grass px-6 py-3 rounded-lg disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-hand text-2xl text-primary mb-1">When works for you?</h2>
          <p className="text-foreground/60 text-sm mb-4">Roughly is fine.</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Weekdays", "Weekends", "Mornings", "Evenings", "Anytime"].map((a) => (
              <button
                key={a}
                onClick={() => setAvailability(a)}
                aria-pressed={availability === a}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  availability === a ? "btn-grass border-accent" : "bg-card border-border hover:border-accent"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={finish}
            disabled={saving}
            className="btn-grass px-6 py-3 rounded-lg inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Show me opportunities
          </button>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="text-center mb-6">
            <Asset name="sparkles.png" alt="" width={50} className="mx-auto mb-2" />
            <h1 className="font-hand text-3xl text-primary">Here's something good.</h1>
            <p className="text-foreground/70 text-sm">Based on what you selected.</p>
          </div>
          <div className="space-y-3 mb-6">
            {opps.map((o) => (
              <Link
                to={`/opportunity/${o.id}`}
                key={o.id}
                className="block paper rounded-xl border border-border/70 p-4 hover:border-accent transition-colors"
              >
                <p className="text-xs font-semibold text-accent">{o.organization}</p>
                <p className="font-bold text-primary">{o.title}</p>
                <p className="text-xs text-foreground/60">{o.location} · {o.cause}</p>
              </Link>
            ))}
          </div>
          <button onClick={() => navigate("/browse")} className="btn-grass px-6 py-3 rounded-lg">Browse all</button>
        </div>
      )}
    </div>
  );
}