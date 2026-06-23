"use client";

import Link from "next/link";
import { useCompareTray } from "@/context/CompareTrayContext";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";

interface CollegeCardProps {
  college: {
    id: number;
    name: string;
    location: string;
    feesPerYear: number;
    rating: number;
    type: string;
    establishedYear: number;
    _count?: { courses: number; reviews: number };
    placements?: Array<{ avgPackage: number; placementRate: number; year: number }>;
  };
  savedIds?: number[];
}

function formatFees(fees: number): string {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L`;
  return `₹${(fees / 1000).toFixed(0)}K`;
}

function formatPackage(pkg: number): string {
  if (pkg >= 100000) return `₹${(pkg / 100000).toFixed(1)}L`;
  return `₹${(pkg / 1000).toFixed(0)}K`;
}

function RatingStars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono-data text-mono font-semibold text-indigo-primary">{rating.toFixed(1)}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill={rating >= star ? "#E8A33D" : "#FAF8F4"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1l1.236 2.506L10 3.942l-2 1.948.472 2.75L6 7.25l-2.472 1.39L4 5.89 2 3.942l2.764-.436L6 1z"
              stroke="#E8A33D"
              strokeWidth="0.8"
              strokeLinejoin="round"
              fill={rating >= star ? "#E8A33D" : "#FAF8F4"}
            />
          </svg>
        ))}
      </div>
      <span className="text-caption text-slate-light">
        ({count})
      </span>
    </div>
  );
}

export function CollegeCard({ college, savedIds = [] }: CollegeCardProps) {
  const { addCollege, removeCollege, isInTray, isFull } = useCompareTray();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const inTray = isInTray(college.id);
  const isSaved = savedIds.includes(college.id);
  const latestPlacement = college.placements?.[0];

  const typeBadgeColor: Record<string, string> = {
    IIT: "badge-amber",
    NIT: "badge-indigo",
    Deemed: "badge-slate",
    Private: "badge-slate",
    Government: "badge-green",
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const method = isSaved ? "DELETE" : "POST";
      const res = await fetch("/api/saved/colleges", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      if (!res.ok) throw new Error("Failed to save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    saveMutation.mutate();
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inTray) {
      removeCollege(college.id);
    } else {
      addCollege({
        id: college.id,
        name: college.name,
        location: college.location,
        rating: college.rating,
      });
    }
  };

  return (
    <article className="card group relative animate-fade-in">
      <Link href={`/colleges/${college.id}`} className="block p-5 pb-4" id={`college-card-${college.id}`}>
        {/* Type badge + save button row */}
        <div className="flex items-start justify-between mb-3">
          <span className={clsx("badge", typeBadgeColor[college.type] ?? "badge-slate")}>
            {college.type}
          </span>
          <button
            onClick={handleSave}
            aria-label={isSaved ? "Unsave college" : "Save college"}
            id={`save-college-${college.id}`}
            className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
              isSaved
                ? "text-amber-accent bg-amber-pale hover:bg-amber-light/30"
                : "text-slate-light hover:text-amber-accent hover:bg-amber-pale"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill={isSaved ? "currentColor" : "none"}>
              <path
                d="M8 13.5l-5.657-5.657a4 4 0 015.657-5.657 4 4 0 015.657 5.657L8 13.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* College name */}
        <h2 className="text-heading-sm font-semibold text-indigo-primary leading-snug mb-1 group-hover:text-indigo-light transition-colors line-clamp-2">
          {college.name}
        </h2>

        {/* Location */}
        <p className="flex items-center gap-1 text-body-sm text-slate-light mb-3">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1a3.5 3.5 0 013.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 016 1z" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="6" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {college.location}
          <span className="text-slate-border mx-1">·</span>
          <span>Est. {college.establishedYear}</span>
        </p>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={college.rating} count={college._count?.reviews ?? 0} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-border/50">
          <div>
            <p className="text-caption text-slate-light uppercase tracking-wide mb-0.5">Fees/Year</p>
            <p className="font-mono-data text-mono font-semibold text-indigo-primary">
              {formatFees(college.feesPerYear)}
            </p>
          </div>
          {latestPlacement && (
            <div>
              <p className="text-caption text-slate-light uppercase tracking-wide mb-0.5">Avg Package</p>
              <p className="font-mono-data text-mono font-semibold text-green-placement">
                {formatPackage(latestPlacement.avgPackage)}
              </p>
            </div>
          )}
        </div>

        {/* Placement rate bar */}
        {latestPlacement && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-caption text-slate-light uppercase tracking-wide">Placement</p>
              <p className="font-mono-data text-mono-sm font-semibold text-green-placement">
                {(latestPlacement.placementRate * 100).toFixed(0)}%
              </p>
            </div>
            <div className="h-1.5 bg-slate-border/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-placement rounded-full transition-all duration-700"
                style={{ width: `${latestPlacement.placementRate * 100}%` }}
              />
            </div>
          </div>
        )}
      </Link>

      {/* Compare button — bottom strip */}
      <div className="px-5 pb-4">
        <button
          onClick={handleCompare}
          id={`compare-btn-${college.id}`}
          disabled={!inTray && isFull}
          className={clsx(
            "w-full py-2 text-body-sm font-medium rounded-lg border transition-all duration-150",
            inTray
              ? "border-amber-accent bg-amber-pale text-amber-accent hover:bg-amber-light/30"
              : isFull
              ? "border-slate-border text-slate-light cursor-not-allowed opacity-50"
              : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary hover:bg-indigo-primary/5"
          )}
        >
          {inTray ? "✓ Added to compare" : isFull ? "Compare tray full" : "+ Add to compare"}
        </button>
      </div>
    </article>
  );
}
