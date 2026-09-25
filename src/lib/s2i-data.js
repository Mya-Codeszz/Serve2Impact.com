// Shared Serve2Impact constants and helpers

// Single source of truth for the cause/category taxonomy used across the whole app.
// Keep this list in sync with the Opportunity entity `cause` enum.
export const CAUSES = [
  "Environment",
  "Animals",
  "Food Access",
  "Education",
  "Community",
  "Housing",
  "Health",
  "Seniors",
  "Youth",
  "Arts & Culture",
  "Disaster Relief",
  "Human Rights",
  "Technology",
];

export const CAUSE_EMOJI = {
  Environment: "🌱",
  Animals: "🐾",
  "Food Access": "🍎",
  Education: "📚",
  Community: "🤝",
  Housing: "🏠",
  Health: "❤️",
  Seniors: "👵",
  Youth: "🧒",
  "Arts & Culture": "🎨",
  "Disaster Relief": "🚨",
  "Human Rights": "✊",
  Technology: "💻",
  // Aliases for records still using the legacy entity enum values.
  Food: "🍎",
  Arts: "🎨",
};

// Pastel category treatment — soft bg + readable text. Used on cards & mockups.
export const CAUSE_COLORS = {
  Environment: { bg: "#dcfce7", text: "#166534" },     // green
  Animals: { bg: "#fce7f3", text: "#9d174d" },          // pink
  "Food Access": { bg: "#ffedd5", text: "#9a3412" },    // orange
  Education: { bg: "#dbeafe", text: "#1e40af" },        // blue
  Community: { bg: "#ede9fe", text: "#5b21b6" },        // lavender
  Housing: { bg: "#e0e7ff", text: "#3730a3" },          // indigo
  Health: { bg: "#fee2e2", text: "#991b1b" },           // red
  Seniors: { bg: "#ccfbf1", text: "#115e59" },          // teal
  Youth: { bg: "#cffafe", text: "#155e75" },            // sky
  "Arts & Culture": { bg: "#fef9c3", text: "#854d0e" }, // yellow
  "Disaster Relief": { bg: "#ffe4e6", text: "#9f1239" },// rose
  "Human Rights": { bg: "#e0e7ff", text: "#4338ca" },   // indigo-deep
  Technology: { bg: "#cffafe", text: "#0e7490" },       // cyan
  // Aliases for records still using the legacy entity enum values.
  Food: { bg: "#ffedd5", text: "#9a3412" },
  Arts: { bg: "#fef9c3", text: "#854d0e" },
};

export const causeColor = (cause) => CAUSE_COLORS[cause] || CAUSE_COLORS.Community;

// First 1–2 letters of an organization name, uppercased — used as a photo-free avatar.
export const orgInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase() || name.slice(0, 2).toUpperCase();
};

// Minutes between start_time and end_time (handles overnight wrap).
export const durationMins = (opp) => {
  const s = opp?.start_time, e = opp?.end_time;
  if (!s || !e) return null;
  const [sh, sm] = s.split(":").map(Number);
  const [eh, em] = e.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => isNaN(n))) return null;
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return mins;
};

export const fmtDuration = (opp) => {
  const m = durationMins(opp);
  if (m == null) return null;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
};

// Asset path helper — assets live in /public/assets
export const asset = (name) => `/assets/${name}`;

export const ACHIEVEMENTS = [
  { key: "first_step", title: "First Step", desc: "Complete your first volunteer opportunity.", icon: "star", category: "Getting Started", goal: 1 },
  { key: "cause_explorer", title: "Cause Explorer", desc: "Volunteer with 3 different causes.", icon: "compass", category: "Discovery", goal: 3 },
  { key: "community_builder", title: "Community Builder", desc: "Complete 5 opportunities.", icon: "people", category: "Community", goal: 5 },
  { key: "earth_helper", title: "Earth Helper", desc: "Volunteer for 3 Environment opportunities.", icon: "earth", category: "Planet", goal: 3 },
  { key: "crew_leader", title: "Crew Leader", desc: "Join a crew and volunteer together.", icon: "people", category: "Social", goal: 1 },
  { key: "changemaker", title: "Changemaker", desc: "Reach 50 hours volunteered.", icon: "sparkles", category: "Milestone", goal: 50 },
];

// Formats: used in filters, detail, and org forms.
export const FORMATS = ["in-person", "virtual", "hybrid"];
export const FORMAT_LABEL = {
  "in-person": "In person",
  virtual: "Virtual",
  hybrid: "Hybrid",
};
export const FORMAT_EMOJI = {
  "in-person": "📍",
  virtual: "💻",
  hybrid: "🔀",
};

export const AGE_OPTIONS = ["All ages", "12+", "14+", "15+", "16+", "18+"];

export const PHYSICAL_OPTIONS = ["Light", "Moderate", "Active"];

export const OPPORTUNITY_TYPES = ["One-time", "Ongoing", "Event"];

export const SKILL_OPTIONS = [
  "No experience needed",
  "Working with kids",
  "Working with seniors",
  "Technology",
  "Cooking",
  "Sorting & packing",
  "Cleaning",
  "Gardening",
  "Art & design",
  "Writing",
  "Math & reading",
  "Coding",
  "Driving",
];

export const DAYS = ["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"];

// Format a structured location into a single readable string. Never invents distance.
export const fmtLocation = (o) => {
  if (!o) return "";
  if (o.format === "virtual") return "Virtual";
  const parts = [o.neighborhood, o.city, o.state].filter(Boolean);
  return parts.length ? parts.join(", ") : o.location || "";
};

export const fmtDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
};

export const spotsLeft = (o) => Math.max(0, (o.spots_total || 0) - (o.spots_filled || 0));