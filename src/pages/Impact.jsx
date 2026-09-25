import React from "react";
import { Link } from "react-router-dom";
import { useUserStats } from "@/hooks/useUserStats";
import { useAuth } from "@/lib/AuthContext";
import Asset from "@/components/Asset";
import StickyNote from "@/components/StickyNote";
import ImpactGarden from "@/components/ImpactGarden";
import { jsPDF } from "jspdf";
import { toast } from "@/components/ui/use-toast";
import { fmtDate, CAUSE_EMOJI, causeColor } from "@/lib/s2i-data";

const MILESTONES = [
  { count: 1, label: "First step", icon: "star.png" },
  { count: 5, label: "Getting consistent", icon: "sparkles.png" },
  { count: 10, label: "Double digits", icon: "burst.png" },
  { count: 25, label: "Quarter century", icon: "heart.png" },
];

export default function Impact() {
  const { user } = useAuth();
  const { loading, hours, opportunitiesCompleted, impactByUnit, achievements, signups } = useUserStats();
  const rawName = (user?.full_name || "friend").split(" ")[0];
  const name = rawName.length > 14 ? rawName.slice(0, 13) + "…" : rawName;
  const causes = Array.from(new Set(signups.map((s) => s.cause).filter(Boolean)));
  const dateGenerated = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const completed = signups.filter((s) => s.status === "checked_in" || s.status === "completed");
  const unlockedMilestones = MILESTONES.filter((m) => opportunitiesCompleted >= m.count);

  const stats = [
    { label: "Hours volunteered", value: hours },
    { label: "Opportunities completed", value: opportunitiesCompleted },
    { label: "Causes explored", value: causes.length },
    ...Object.entries(impactByUnit).map(([unit, val]) => ({ label: unit, value: val })),
  ].filter((s) => s.value > 0 || s.label === "Hours volunteered");

  const downloadReceipt = () => {
    const doc = new jsPDF({ unit: "pt", format: [260, 420] });
    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SERVE2IMPACT", 130, y, { align: "center" });
    y += 16;
    doc.setFontSize(11);
    doc.text("YOUR IMPACT", 130, y, { align: "center" });
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${name}  ·  ${dateGenerated}`, 130, y, { align: "center" });
    y += 24;
    doc.setLineDashPattern([2, 2], 1);
    doc.line(20, y, 240, y);
    doc.setLineDashPattern([], 1);
    y += 26;
    stats.forEach((s) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(String(s.value).toUpperCase(), 130, y, { align: "center" });
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(String(s.label).toUpperCase(), 130, y, { align: "center" });
      y += 14;
      doc.line(60, y, 200, y);
      y += 22;
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("KEEP MAKING", 130, y, { align: "center" });
    y += 14;
    doc.text("AN IMPACT", 130, y, { align: "center" });
    doc.save("serve2impact-receipt.pdf");
    toast({ title: "Receipt downloaded", description: "Share it with your crew!" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10 relative">
        <h1 className="font-hand text-primary" style={{ fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
          Look what you did!
        </h1>
        <Asset name="look_what_you_did.png" alt="look what you did" width={220} className="mx-auto -mt-2" />
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-secondary/60 animate-pulse" />)}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-16 mb-8">
          <Asset name="smiley.png" alt="" width={70} className="mx-auto mb-3" />
          <p className="font-hand text-2xl text-foreground/70">No impact logged yet — your first shift starts the story.</p>
          <Link to="/browse" className="btn-grass inline-block mt-5 px-5 py-2.5 rounded-lg">Find an opportunity →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="paper rounded-xl border border-border/70 p-5 text-center">
              <div className="text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-foreground/70 mt-1 capitalize">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Impact trail + receipt */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="flex items-center justify-center">
          <ImpactGarden completed={opportunitiesCompleted} width={240} />
        </div>
        <div>
          <div className="relative inline-block">
            <StickyNote color="green" width={240} rotate={-3}>
              <span className="block">Nice work,</span>
              <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{name}!</span>
            </StickyNote>
          </div>
          <div className="paper-cream rounded-lg border border-dashed border-border p-6 max-w-sm mt-4 font-mono text-sm" style={{ boxShadow: "2px 3px 0 rgba(31,58,40,0.08)" }}>
            <div className="text-center font-bold tracking-wide">SERVE2IMPACT</div>
            <div className="text-center text-foreground/60">YOUR IMPACT</div>
            <div className="text-center text-foreground/50 text-xs mb-2">{name} · {dateGenerated}</div>
            <div className="dashed-rule mb-3" />
            {stats.map((s) => (
              <div key={s.label} className="mb-3">
                <div className="text-center font-bold text-lg">{s.value}</div>
                <div className="text-center text-foreground/60 uppercase text-xs">{s.label}</div>
                <div className="dashed-rule mt-2" />
              </div>
            ))}
            <div className="text-center font-bold mt-3 text-primary">KEEP MAKING AN IMPACT</div>
          </div>
          <button onClick={downloadReceipt} className="btn-grass mt-4 px-5 py-2.5 rounded-lg inline-flex items-center gap-2">
            ⬇ Download receipt
          </button>
        </div>
      </div>

      {/* Causes explored */}
      {!loading && causes.length > 0 && (
        <div className="mb-12">
          <h2 className="font-bold text-primary text-lg mb-4">Causes explored</h2>
          <div className="flex flex-wrap gap-3">
            {causes.map((c) => {
              const col = causeColor(c);
              return (
                <div key={c} className="paper rounded-xl border border-border/70 px-4 py-3 flex items-center gap-2" style={{ backgroundColor: col.bg }}>
                  <span className="text-lg" aria-hidden>{CAUSE_EMOJI[c]}</span>
                  <span className="text-sm font-semibold" style={{ color: col.text }}>{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestones */}
      {!loading && (
        <div className="mb-12">
          <h2 className="font-bold text-primary text-lg mb-4">Milestones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MILESTONES.map((m) => {
              const reached = opportunitiesCompleted >= m.count;
              return (
                <div key={m.count} className={`paper rounded-xl border p-4 text-center ${reached ? "border-accent" : "border-border/70 opacity-60"}`}>
                  <div className="flex items-center justify-center mb-2">
                    <Asset name={m.icon} alt="" width={36} className={reached ? "" : "grayscale opacity-40"} />
                  </div>
                  <p className="font-bold text-primary text-sm">{m.count} opportunities</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{m.label}</p>
                  {reached ? (
                    <span className="inline-block mt-2 text-xs font-semibold text-accent">✓ Reached</span>
                  ) : (
                    <span className="inline-block mt-2 text-xs text-foreground/40">{Math.max(0, m.count - opportunitiesCompleted)} to go</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Volunteer history */}
      {!loading && (
        <div>
          <h2 className="font-bold text-primary text-lg mb-4">Volunteer history</h2>
          {completed.length === 0 ? (
            <div className="paper rounded-xl border border-border/70 p-6 text-center">
              <Asset name="smiley.png" alt="" width={50} className="mx-auto mb-2" />
              <p className="font-hand text-xl text-foreground/70">No adventures yet</p>
              <p className="text-foreground/60 text-sm mt-1">Complete your first opportunity to start your history.</p>
              <Link to="/browse" className="btn-grass inline-block mt-3 px-4 py-2 rounded-lg text-sm">Find your first opportunity →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((s) => (
                <div key={s.id} className="paper rounded-xl border border-border/70 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0" aria-hidden>
                    <span className="text-lg">{CAUSE_EMOJI[s.cause] || "🌱"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate">{s.opportunity_title}</p>
                    <p className="text-xs text-foreground/60">{s.organization} · {fmtDate(s.date)} · {s.hours || 0} hrs</p>
                  </div>
                  {s.impact_value ? (
                    <span className="font-hand text-base text-accent shrink-0">≈ {s.impact_value} {s.impact_unit}</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}