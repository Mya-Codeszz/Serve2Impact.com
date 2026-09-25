import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Asset from "@/components/Asset";
import CompletionMoment from "@/components/CompletionMoment";
import { opportunityService } from "@/services/opportunities";
import { signupService } from "@/services/signups";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/components/ui/use-toast";

export default function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opp, setOpp] = useState(null);
  const [signup, setSignup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const o = await opportunityService.get(id);
        if (!active) return;
        setOpp(o);
        if (o && user) {
          const mine = await signupService.getForOpportunity(id, user.id);
          if (active && mine.length) {
            setSignup(mine[0]);
            if (mine[0].status === "checked_in" || mine[0].status === "completed") {
              setCheckedIn(true);
            }
          }
        }
      } catch { /* ignore */ }
      if (active) setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [id, user]);

  const checkIn = async () => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(`/check-in/${id}`)}`);
      return;
    }
    setProcessing(true);
    try {
      if (!signup) {
        // Create a signup on the fly if they came directly, then check in
        const created = await signupService.create(opp, user.id);
        const checked = await signupService.checkIn(created.id);
        setSignup(checked);
      } else {
        const checked = await signupService.checkIn(signup.id);
        setSignup(checked);
      }
      setCheckedIn(true);
      toast({ title: "Checked in!", description: "Have a great shift." });
    } catch (e) {
      toast({ title: "Check-in failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  if (!opp) {
    return (
      <div className="py-24 text-center">
        <Asset name="smiley.png" alt="" width={70} className="mx-auto mb-3" />
        <p className="font-hand text-2xl text-foreground/80">This opportunity isn't available.</p>
        <Link to="/browse" className="inline-block text-accent font-semibold mt-4">Back to browse</Link>
      </div>
    );
  }

  if (checkedIn) {
    const firstName = user?.full_name?.split(" ")[0] || "friend";
    const hrs = signup?.hours || 3;
    const impactText = signup?.impact_value ? `+${signup.impact_value} ${signup.impact_unit || ""}` : null;
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center relative">
        <CompletionMoment hours={hrs} impactText={impactText} />
        <p className="text-foreground/70 mt-4">Have a great shift, {firstName}.</p>
        <Asset name="thank_you_for_showing_up.png" alt="thank you for showing up" width={240} className="mx-auto mt-6" />
        <div className="flex flex-col items-center gap-3 mt-6">
          <button onClick={() => navigate("/dashboard")} className="btn-grass px-5 py-2.5 rounded-lg">Back to dashboard</button>
          <Link to="/impact" className="text-sm font-semibold text-accent hover:underline">See your impact →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <Asset name="earth.png" alt="" width={70} className="mx-auto mb-4" />
      <h1 className="font-hand text-4xl text-primary">You're here!</h1>
      <p className="text-foreground/70 mt-1 mb-6">{opp.title} · {opp.organization}</p>
      <button
        onClick={checkIn}
        disabled={processing}
        className="btn-grass px-10 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2 disabled:opacity-50"
      >
        {processing && <Loader2 className="w-5 h-5 animate-spin" />} Check In
      </button>
      <p className="font-hand text-xl text-foreground/60 mt-6">you've got this</p>
    </div>
  );
}