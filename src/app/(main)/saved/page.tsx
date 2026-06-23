"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ErrorState, AuthPrompt } from "@/components/StateComponents";
import { CollegeCard } from "@/components/CollegeCard";
import { CollegeGridSkeleton } from "@/components/LoadingSkeletons";
import { clsx } from "clsx";

type Tab = "colleges" | "comparisons";

function SavedColleges() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["saved-colleges"],
    queryFn: async () => {
      const res = await fetch("/api/saved/colleges");
      if (!res.ok) throw new Error("Failed to fetch saved colleges");
      return res.json();
    },
  });

  if (isLoading) return <CollegeGridSkeleton count={6} />;
  if (isError) return <ErrorState message="Could not load your saved colleges." />;

  const saved = data?.data ?? [];
  const savedIds = saved.map((s: { collegeId: number }) => s.collegeId);
  const colleges = saved.map((s: { college: Record<string, unknown> }) => s.college);

  if (colleges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-amber-pale rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21l-8-8a5.657 5.657 0 018-8 5.657 5.657 0 018 8l-8 8z" stroke="#E8A33D" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h3 className="text-heading-sm text-indigo-primary mb-2">No saved colleges yet</h3>
        <p className="text-body-sm text-slate-light mb-4">Browse colleges and click the heart icon to save them here.</p>
        <a href="/" className="btn-amber">Browse Colleges</a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {colleges.map((college: Parameters<typeof CollegeCard>[0]["college"]) => (
        <CollegeCard key={college.id} college={college} savedIds={savedIds} />
      ))}
    </div>
  );
}

function SavedComparisons() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["saved-comparisons"],
    queryFn: async () => {
      const res = await fetch("/api/saved/comparisons");
      if (!res.ok) throw new Error("Failed to fetch saved comparisons");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch("/api/saved/comparisons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-comparisons"] }),
  });

  if (isLoading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-card" />)}
    </div>
  );
  if (isError) return <ErrorState message="Could not load your saved comparisons." />;

  const comparisons = data?.data ?? [];

  if (comparisons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-indigo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="18" rx="1" stroke="#1E2A4A" strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="18" rx="1" stroke="#1E2A4A" strokeWidth="1.5" />
          </svg>
        </div>
        <h3 className="text-heading-sm text-indigo-primary mb-2">No saved comparisons</h3>
        <p className="text-body-sm text-slate-light mb-4">Compare colleges and save your comparisons for later.</p>
        <a href="/" className="btn-primary">Start Comparing</a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comparisons.map((comp: {
        id: number;
        createdAt: string;
        colleges: Array<{ id: number; name: string; location: string; rating: number }>;
        collegeIds: number[];
      }) => (
        <div key={comp.id} className="card p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-indigo-primary mb-1">
              {comp.colleges?.map((c) => c.name.split(" ").slice(0, 3).join(" ")).join(" vs ")}
            </p>
            <div className="flex items-center gap-3">
              {comp.colleges?.map((c) => (
                <span key={c.id} className="text-caption text-slate-light">
                  <span className="font-mono-data font-medium text-indigo-primary">{c.rating.toFixed(1)}</span> {c.name.split(" ").slice(-1)}
                </span>
              ))}
            </div>
            <p className="text-caption text-slate-light mt-1">
              Saved {new Date(comp.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/compare?ids=${comp.collegeIds.join(",")}`}
              className="btn-outline text-body-sm"
              id={`view-comparison-${comp.id}`}
            >
              View
            </a>
            <button
              onClick={() => deleteMutation.mutate(comp.id)}
              disabled={deleteMutation.isPending}
              id={`delete-comparison-${comp.id}`}
              aria-label="Delete comparison"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-light hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M5 4V2.5h4V4M6 6.5v4M8 6.5v4M3 4l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<Tab>("colleges");

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="skeleton h-8 w-48 rounded mb-4" />
        <CollegeGridSkeleton count={6} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AuthPrompt action="view saved items" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-display text-indigo-primary mb-2">Saved Items</h1>
        <p className="text-body text-slate-body">Your shortlisted colleges and saved comparisons.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-border/60 mb-6">
        <nav className="flex gap-0 -mb-px" aria-label="Saved items tabs">
          {(["colleges", "comparisons"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              id={`saved-tab-${t}`}
              className={clsx(
                "px-5 py-3 text-body-sm font-medium border-b-2 transition-all duration-150 capitalize",
                tab === t
                  ? "border-indigo-primary text-indigo-primary"
                  : "border-transparent text-slate-light hover:text-slate-body hover:border-slate-border"
              )}
              aria-selected={tab === t}
              role="tab"
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      <div className="animate-fade-in">
        {tab === "colleges" ? <SavedColleges /> : <SavedComparisons />}
      </div>
    </div>
  );
}
