import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, Calendar, Clock, MapPin, ArrowLeft, Loader2, Check, Users, Sparkles, Hand } from "lucide-react";
import Asset from "@/components/Asset";
import { opportunityService } from "@/services/opportunities";
import { signupService } from "@/services/signups";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useAuth } from "@/lib/AuthContext";
import {
  CAUSE_EMOJI,
  causeColor,
  fmtDate,
  fmtDuration,
  fmtLocation,
  FORMAT_LABEL,
  FORMAT_EMOJI,
  spotsLeft,
} from "@/lib/s2i-data";
import { toast } from "@/components/ui/use-toast";

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm text-foreground/80">
      <span className="text-accent mt-0.5">{icon}</span>
      <span><span className="font-semibold text-foreground/90">{label}: </span>{value}</span>
    </div>
  );
}

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSaved, toggle } = useSavedOpportunities();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [existingSignup, setExistingSignup] = useState(null);
  const [justSignedUp, setJustSignedUp] = useState(false);

  const saved = isSaved(id);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setOpp(null);
    setExistingSignup(null);
    setJustSignedUp(false);
    (async () => {
      const o = await opportunityService.get(id);
      if (!active) return;
      setOpp(o);
      if (o && user) {
        const mine = await signupService.getForOpportunity(id, user.id);
        if (active && mine.length) setExistingSignup(mine[0]);
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [id, user]);

  const onSignUp = async () => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(`/opportunity/${id}`)}`);
      return;
    }
    setSigning(true);
    try {
      const signup = await signupService.create(opp, user.id);
      setExistingSignup(signup);
      setJustSignedUp(true);
      toast({ title: "You're signed up!", description: "Check your dashboard for upcoming shifts." });
    } catch (e) {
      toast({ title: "Couldn't sign up", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return <div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  if (!opp) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Asset name="smiley.png" alt="" width={70} className="mx-auto mb-4" />
        <p className="font-hand text-2xl text-foreground/80">This opportunity isn't available.</p>
        <p className="text-foreground/60 mt-2">It may have been removed or the link is wrong.</p>
        <Link to="/browse" className="inline-flex items-center gap-1 text-accent font-semibold mt-5">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>
      </div>
    );
  }

  const left = spotsLeft(opp);
  const isFull = left <= 0;
  const isSignedUp = !!existingSignup || justSignedUp;
  const c = causeColor(opp.cause);
  const dur = fmtDuration(opp) || opp.time_commitment;
  const isDemo = opportunityService.isDemo(opp);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/70 hover:text-accent mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      {isDemo && (
        <p className="mb-4 text-xs font-medium text-foreground/50 inline-flex items-center gap-1.5 bg-secondary/70 border border-border/60 rounded-full px-3 py-1">
          <Sparkles className="w-3.5 h-3.5" /> Demo opportunity — sample data
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left image */}
        <div className="rounded-xl overflow-hidden border border-border/70 bg-secondary h-72 md:h-96 relative">
          {opp.image_url ? (
            <img src={opp.image_url} alt={opp.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: c.bg }}>
              <span className="text-6xl" aria-hidden>{CAUSE_EMOJI[opp.cause]}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => toggle(opp.id)}
            aria-label={saved ? "Unsave opportunity" : "Save opportunity"}
            aria-pressed={saved}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
              saved ? "bg-highlight/90 border-highlight text-primary" : "bg-card/90 border-border/70 text-foreground/60 hover:text-accent"
            }`}
          >
            <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Right details */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: c.bg, color: c.text }}>
              {CAUSE_EMOJI[opp.cause]} {opp.cause}
            </span>
            {opp.format && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary border border-border">
                {FORMAT_EMOJI[opp.format]} {FORMAT_LABEL[opp.format]}
              </span>
            )}
            {opp.recurring && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary border border-border">Recurring</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary leading-tight">{opp.title}</h1>
          <Link to={`/organization/${opp.organization_id || ""}`} className="text-sm font-semibold text-accent hover:underline block">{opp.organization}</Link>

          <div className="grid grid-cols-1 gap-2 text-sm text-foreground/80">
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={fmtLocation(opp)} />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={fmtDate(opp.date)} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Time" value={`${opp.start_time || ""}${opp.end_time ? ` – ${opp.end_time}` : ""}`} />
            {dur && <InfoRow icon={<Clock className="w-4 h-4" />} label="Time commitment" value={dur} />}
            <InfoRow icon={<Users className="w-4 h-4" />} label="Age requirement" value={opp.age_requirement || "All ages"} />
            <InfoRow icon={<Hand className="w-4 h-4" />} label="Physical activity" value={opp.physical_activity} />
            {opp.skills?.length > 0 && <InfoRow icon={<Sparkles className="w-4 h-4" />} label="Good for" value={opp.skills.join(", ")} />}
            {opp.opportunity_type && <InfoRow icon={<Calendar className="w-4 h-4" />} label="Type" value={opp.opportunity_type} />}
          </div>

          {opp.description && (
            <div>
              <p className="text-sm font-semibold text-primary mb-1">What you'll do</p>
              <p className="text-foreground/75 leading-relaxed">{opp.description}</p>
            </div>
          )}

          <div className="paper rounded-xl border border-border/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-primary">Volunteer spots</span>
              <span className="text-sm text-foreground/70">
                {isFull ? "Full" : opp.spots_total != null ? `${left} of ${opp.spots_total} left` : "Open"}
              </span>
            </div>
            {opp.spots_total != null && (
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
                <div className="h-full bg-accent" style={{ width: `${Math.min(100, ((opp.spots_filled || 0) / (opp.spots_total || 1)) * 100)}%` }} />
              </div>
            )}
            {opp.impact_value ? (
              <p className="font-hand text-lg text-accent mb-3">≈ {opp.impact_value} {opp.impact_unit} 🌟</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              {isSignedUp ? (
                <span className="btn-grass px-5 py-2.5 rounded-lg inline-flex items-center gap-2">
                  <Check className="w-4 h-4" /> You're signed up
                </span>
              ) : isFull ? (
                <span className="px-5 py-2.5 rounded-lg border border-border text-foreground/60 font-semibold inline-flex items-center gap-2">
                  This shift is full
                </span>
              ) : (
                <button onClick={onSignUp} disabled={signing} className="btn-grass px-5 py-2.5 rounded-lg disabled:opacity-50 inline-flex items-center gap-2">
                  {signing && <Loader2 className="w-4 h-4 animate-spin" />} Sign up
                </button>
              )}
              <button
                onClick={() => toggle(opp.id)}
                className={`px-4 py-2.5 rounded-lg border font-semibold inline-flex items-center gap-2 ${saved ? "bg-highlight/30 border-highlight text-primary" : "border-border"}`}
              >
                <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Saved" : "Save"}
              </button>
            </div>
            {justSignedUp && (
              <p className="text-sm text-accent mt-3 font-medium">Nice — see it on your <Link to="/dashboard" className="underline">dashboard</Link>.</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Asset name="youve_got_this.png" alt="you've got this" width={170} className="rotate-neg-3" />
          </div>
        </div>
      </div>
    </div>
  );
}