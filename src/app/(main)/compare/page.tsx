"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { CompareTableSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState, EmptyState } from "@/components/StateComponents";
import { clsx } from "clsx";

function formatFees(fees: number) {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L`;
  return `₹${(fees / 1000).toFixed(0)}K`;
}

function formatPackage(pkg: number) {
  return `₹${(pkg / 100000).toFixed(1)}L`;
}

interface CompareCollege {
  id: number;
  name: string;
  location: string;
  type: string;
  establishedYear: number;
  rating: number;
  feesPerYear: number;
  reviewCount: number;
  coursesCount: number;
  courses: Array<{ id: number; name: string; durationYears: number; feesPerYear: number }>;
  latestPlacement: {
    year: number;
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
  } | null;
}

const COMPARE_ROWS: Array<{
  label: string;
  key: keyof CompareCollege | "latestPlacement";
  format: (college: CompareCollege) => React.ReactNode;
  highlight?: (colleges: CompareCollege[]) => number | null; // returns index of "best" college
}> = [
  {
    label: "Location",
    key: "location",
    format: (c) => c.location,
  },
  {
    label: "Type",
    key: "type",
    format: (c) => <span className="badge badge-indigo">{c.type}</span>,
  },
  {
    label: "Established",
    key: "establishedYear",
    format: (c) => <span className="font-mono-data">{c.establishedYear}</span>,
    highlight: (cs) => cs.reduce((best, c, i, arr) => c.establishedYear < arr[best].establishedYear ? i : best, 0),
  },
  {
    label: "Rating",
    key: "rating",
    format: (c) => (
      <span className="font-mono-data text-mono font-bold text-amber-accent">{c.rating.toFixed(1)} / 5.0</span>
    ),
    highlight: (cs) => cs.reduce((best, c, i, arr) => c.rating > arr[best].rating ? i : best, 0),
  },
  {
    label: "Fees / Year",
    key: "feesPerYear",
    format: (c) => <span className="font-mono-data text-mono font-semibold">{formatFees(c.feesPerYear)}</span>,
    highlight: (cs) => cs.reduce((best, c, i, arr) => c.feesPerYear < arr[best].feesPerYear ? i : best, 0),
  },
  {
    label: "Courses Offered",
    key: "coursesCount",
    format: (c) => <span className="font-mono-data">{c.coursesCount}</span>,
  },
  {
    label: "Avg Package",
    key: "latestPlacement",
    format: (c) =>
      c.latestPlacement ? (
        <span className="font-mono-data text-mono font-semibold text-green-placement">
          {formatPackage(c.latestPlacement.avgPackage)}
        </span>
      ) : (
        <span className="text-slate-light text-caption">N/A</span>
      ),
    highlight: (cs) => {
      const withP = cs.filter((c) => c.latestPlacement);
      if (!withP.length) return null;
      return cs.reduce(
        (best, c, i, arr) =>
          (c.latestPlacement?.avgPackage ?? 0) > (arr[best].latestPlacement?.avgPackage ?? 0) ? i : best,
        0
      );
    },
  },
  {
    label: "Highest Package",
    key: "latestPlacement",
    format: (c) =>
      c.latestPlacement ? (
        <span className="font-mono-data text-mono font-semibold text-indigo-primary">
          {formatPackage(c.latestPlacement.highestPackage)}
        </span>
      ) : (
        <span className="text-slate-light text-caption">N/A</span>
      ),
  },
  {
    label: "Placement Rate",
    key: "latestPlacement",
    format: (c) =>
      c.latestPlacement ? (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono-data text-mono font-bold text-green-placement">
            {(c.latestPlacement.placementRate * 100).toFixed(0)}%
          </span>
          <div className="h-1.5 bg-slate-border/40 rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-green-placement rounded-full"
              style={{ width: `${c.latestPlacement.placementRate * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <span className="text-slate-light text-caption">N/A</span>
      ),
    highlight: (cs) => {
      const withP = cs.filter((c) => c.latestPlacement);
      if (!withP.length) return null;
      return cs.reduce(
        (best, c, i, arr) =>
          (c.latestPlacement?.placementRate ?? 0) > (arr[best].latestPlacement?.placementRate ?? 0) ? i : best,
        0
      );
    },
  },
  {
    label: "Reviews",
    key: "reviewCount",
    format: (c) => <span className="font-mono-data">{c.reviewCount}</span>,
  },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const idsParam = searchParams.get("ids") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["compare", idsParam],
    queryFn: async () => {
      if (!idsParam) throw new Error("No colleges selected");
      const res = await fetch(`/api/compare?ids=${idsParam}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    enabled: idsParam.length > 0,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const collegeIds = idsParam.split(",").map(Number);
      const res = await fetch("/api/saved/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
    },
    onSuccess: () => setSaveSuccess(true),
  });

  if (!idsParam) {
    return (
      <EmptyState
        title="No colleges to compare"
        message="Add colleges to the compare tray while browsing, then click 'Compare now'."
        action={{ label: "Browse Colleges", href: "/" }}
      />
    );
  }

  if (isLoading) return <CompareTableSkeleton />;

  if (isError || !data?.data) {
    return (
      <ErrorState
        title="Comparison failed"
        message={data?.error ?? "Could not load comparison data. Ensure you selected 2–3 valid colleges."}
      />
    );
  }

  const colleges: CompareCollege[] = data.data;
  const colCount = colleges.length;

  return (
    <div className="space-y-6">
      {/* College header row */}
      <div className="card overflow-hidden">
        <div className={clsx("grid divide-x divide-slate-border/60", `grid-cols-${colCount}`)}>
          {colleges.map((college) => (
            <div key={college.id} className="p-5">
              <span className="badge badge-indigo mb-2 inline-block">{college.type}</span>
              <h3 className="text-heading-sm font-semibold text-indigo-primary leading-snug mb-1">
                <a href={`/colleges/${college.id}`} className="hover:text-indigo-light transition-colors">
                  {college.name}
                </a>
              </h3>
              <p className="text-body-sm text-slate-light">{college.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-slate-border/40">
              {COMPARE_ROWS.map((row) => {
                const bestIdx = row.highlight?.(colleges) ?? null;
                return (
                  <tr key={row.label} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="px-6 py-4 w-36 shrink-0 text-caption font-medium text-slate-light uppercase tracking-wide border-r border-slate-border/40 bg-surface-muted/50">
                      {row.label}
                    </td>
                    {colleges.map((college, i) => (
                      <td
                        key={college.id}
                        className={clsx(
                          "px-6 py-4 text-body-sm",
                          i < colleges.length - 1 && "border-r border-slate-border/40",
                          bestIdx === i && "bg-green-placement/5"
                        )}
                      >
                        {row.format(college)}
                        {bestIdx === i && (
                          <span className="ml-2 text-[10px] font-semibold text-green-placement uppercase tracking-wide">Best</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courses comparison */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-border/60">
          <h2 className="section-heading">Courses Offered</h2>
        </div>
        <div className={clsx("grid divide-x divide-slate-border/60", `grid-cols-${colCount}`)}>
          {colleges.map((college) => (
            <div key={college.id} className="p-5">
              <p className="text-caption font-medium text-slate-light uppercase tracking-wide mb-3">{college.name.split(" ").slice(0, 4).join(" ")}</p>
              <ul className="space-y-2">
                {college.courses.map((course) => (
                  <li key={course.id} className="text-body-sm text-slate-body">
                    <span className="font-medium text-indigo-primary">{course.name}</span>
                    <div className="flex items-center gap-3 mt-0.5 text-caption text-slate-light">
                      <span className="font-mono-data">{course.durationYears}yr</span>
                      <span className="font-mono-data">{formatFees(course.feesPerYear)}/yr</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Save comparison */}
      <div className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-body-sm font-medium text-indigo-primary">Save this comparison</p>
          <p className="text-caption text-slate-light">Revisit it anytime from your Saved Items</p>
        </div>
        {session ? (
          saveSuccess ? (
            <p className="text-body-sm text-green-placement font-medium">✓ Comparison saved!</p>
          ) : (
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              id="save-comparison-btn"
              className="btn-amber"
            >
              {saveMutation.isPending ? "Saving..." : "Save Comparison"}
            </button>
          )
        ) : (
          <div className="flex gap-2">
            <a href="/login" className="btn-outline text-body-sm">Sign in to save</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-headline text-display text-indigo-primary mb-2">Compare Colleges</h1>
          <p className="text-body text-slate-body">Side-by-side comparison of fees, placements, and key metrics.</p>
        </div>
        <a href="/" className="btn-outline text-body-sm">
          ← Browse more colleges
        </a>
      </div>
      <Suspense fallback={<CompareTableSkeleton />}>
        <CompareContent />
      </Suspense>
    </div>
  );
}
