import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Opportunities", to: "/browse" },
  { label: "Find your match", to: "/match" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Stories", to: "/stories" },
  { label: "For Organizations", to: "/organizations" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/60">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight text-primary">
          Serve<span style={{ color: "hsl(var(--sky))" }}>2</span>Impact
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? "text-accent" : "text-foreground/80 hover:text-accent"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/saved" className="text-sm font-semibold text-foreground/80 hover:text-accent">Saved</Link>
              <Button asChild className="btn-grass h-9 px-4 text-sm">
                <Link to="/dashboard">My dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-foreground/80 hover:text-accent">
                Log in
              </Link>
              <Button asChild className="btn-grass h-9 px-4 text-sm">
                <Link to="/register">Join Serve2Impact</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile overlay panel */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[78%] max-w-xs bg-background shadow-xl border-l border-border/60 flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border/60 shrink-0">
              <span className="font-extrabold text-primary">Menu</span>
              <button
                className="p-2 -mr-2 text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `block py-3 px-3 rounded-lg text-base font-semibold transition-colors ${isActive ? "bg-secondary text-accent" : "text-foreground/80 hover:bg-secondary"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border/60 p-4 space-y-3 shrink-0">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/saved">Saved opportunities</Link>
                  </Button>
                  <Button asChild className="btn-grass w-full">
                    <Link to="/dashboard">My dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center py-2.5 font-semibold border border-border rounded-lg text-foreground/80 hover:border-accent transition-colors"
                  >
                    Log in
                  </Link>
                  <Button asChild className="btn-grass w-full">
                    <Link to="/register">Join Serve2Impact</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}