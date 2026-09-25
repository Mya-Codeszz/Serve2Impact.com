import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Globe } from "lucide-react";
import Asset from "@/components/Asset";
import OpportunityCard from "@/components/OpportunityCard";
import { organizationService } from "@/services/organizations";
import { opportunityService } from "@/services/opportunities";
import { CAUSE_EMOJI, causeColor } from "@/lib/s2i-data";

export default function OrganizationProfile() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        let o = null;
        if (id) {
          o = await organizationService.get(id);
        } else {
          const list = await organizationService.list();
          if (list.length) o = list[0];
        }
        if (!active) return;
        setOrg(o);
        if (o) {
          const all = await opportunityService.getByOrganization(o.id);
          if (active) setOpps(all);
        }
      } catch { /* ignore */ }
      if (active) setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  if (!org) {
    return (
      <div className="py-24 text-center">
        <Asset name="smiley.png" alt="" width={70} className="mx-auto mb-3" />
        <p className="font-hand text-2xl text-foreground/80">Organization not found.</p>
        <Link to="/browse" className="inline-block text-accent font-semibold mt-4">Browse opportunities</Link>
      </div>
    );
  }

  const c = causeColor(org.cause);
  const isDemo = organizationService.isDemo(org);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {isDemo && (
        <p className="mb-4 text-xs font-medium text-foreground/50 inline-flex items-center gap-1.5 bg-secondary/70 border border-border/60 rounded-full px-3 py-1">
          Demo organization — sample data
        </p>
      )}

      <div className="paper rounded-xl border border-border/70 p-6 mb-8 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: c.bg }}
        >
          <span className="text-2xl" aria-hidden>{CAUSE_EMOJI[org.cause]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-primary">{org.name}</h1>
          <p className="text-sm text-foreground/60 mt-0.5">{org.location} · {CAUSE_EMOJI[org.cause]} {org.cause}</p>
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-accent font-semibold mt-1 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" /> Website
            </a>
          )}
        </div>
      </div>

      {org.about && (
        <div className="mb-8">
          <h2 className="font-bold text-primary mb-2">About</h2>
          <p className="text-foreground/75 leading-relaxed">{org.about}</p>
        </div>
      )}

      <h2 className="font-bold text-primary mb-4">Opportunities</h2>
      {opps.length === 0 ? (
        <div className="text-center py-12 paper rounded-xl border border-border/70">
          <Asset name="smiley.png" alt="" width={50} className="mx-auto mb-2" />
          <p className="font-hand text-xl text-foreground/70">No opportunities listed right now.</p>
          <p className="text-foreground/60 text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {opps.map((o) => <OpportunityCard key={o.id} opp={o} />)}
        </div>
      )}
    </div>
  );
}