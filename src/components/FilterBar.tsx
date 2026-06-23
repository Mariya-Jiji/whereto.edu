"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Indian states that have colleges in our dataset
const STATES = [
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const TYPES = ["IIT", "NIT", "Deemed", "Private", "Government"];

const FEE_PRESETS = [
  { label: "Under ₹1L", min: 0, max: 100000 },
  { label: "₹1L–₹2L", min: 100000, max: 200000 },
  { label: "₹2L–₹3L", min: 200000, max: 300000 },
  { label: "Above ₹3L", min: 300000, max: 10000000 },
];

const RATING_OPTIONS = [
  { label: "4.5+", value: 4.5 },
  { label: "4.0+", value: 4.0 },
  { label: "3.5+", value: 3.5 },
  { label: "Any", value: 0 },
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [minFees, setMinFees] = useState(searchParams.get("minFees") ?? "");
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushFilters = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      const vals = { q, location, type, minFees, maxFees, minRating, ...overrides };
      Object.entries(vals).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [q, location, type, minFees, maxFees, minRating, pathname, router]
  );

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushFilters({ q });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleSelect = (key: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      location: setLocation,
      type: setType,
      minRating: setMinRating,
    };
    setters[key]?.(value);
    pushFilters({ [key]: value });
  };

  const handleFeePreset = (min: number, max: number) => {
    setMinFees(String(min));
    setMaxFees(String(max));
    pushFilters({ minFees: String(min), maxFees: String(max) });
  };

  const handleClearAll = () => {
    setQ(""); setLocation(""); setType("");
    setMinFees(""); setMaxFees(""); setMinRating("");
    router.push(pathname);
  };

  const hasFilters = q || location || type || minFees || maxFees || minRating;

  return (
    <aside className="space-y-6" aria-label="Filter colleges">
      {/* Search */}
      <div>
        <label htmlFor="filter-search" className="label">Search</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="filter-search"
            type="text"
            placeholder="College name, location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input pl-9"
          />
          {q && (
            <button
              onClick={() => { setQ(""); pushFilters({ q: "" }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-light hover:text-slate-body"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="filter-location" className="label">Location</label>
        <select
          id="filter-location"
          value={location}
          onChange={(e) => handleSelect("location", e.target.value)}
          className="input"
        >
          <option value="">All states</option>
          {STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <p className="label">College Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => handleSelect("type", type === t ? "" : t)}
              id={`filter-type-${t}`}
              className={`px-3 py-1 rounded-full text-caption font-medium border transition-all duration-150 ${
                type === t
                  ? "bg-indigo-primary text-white border-indigo-primary"
                  : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Fee range */}
      <div>
        <p className="label">Annual Fees</p>
        <div className="grid grid-cols-2 gap-2">
          {FEE_PRESETS.map((preset) => {
            const active =
              String(preset.min) === minFees && String(preset.max) === maxFees;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  if (active) {
                    setMinFees(""); setMaxFees("");
                    pushFilters({ minFees: "", maxFees: "" });
                  } else {
                    handleFeePreset(preset.min, preset.max);
                  }
                }}
                id={`filter-fee-${preset.label.replace(/[^a-z0-9]/gi, "-")}`}
                className={`px-2 py-1.5 rounded-lg text-caption font-medium border transition-all duration-150 ${
                  active
                    ? "bg-indigo-primary text-white border-indigo-primary"
                    : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <p className="label">Minimum Rating</p>
        <div className="flex gap-2 flex-wrap">
          {RATING_OPTIONS.map((opt) => {
            const active = String(opt.value) === minRating || (opt.value === 0 && !minRating);
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect("minRating", opt.value === 0 ? "" : String(opt.value))}
                id={`filter-rating-${opt.label}`}
                className={`px-3 py-1 rounded-full text-caption font-medium border transition-all duration-150 ${
                  active
                    ? "bg-indigo-primary text-white border-indigo-primary"
                    : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={handleClearAll}
          id="filter-clear-all"
          className="w-full py-2 text-body-sm text-slate-light hover:text-indigo-primary border border-dashed border-slate-border rounded-lg transition-colors duration-150"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
