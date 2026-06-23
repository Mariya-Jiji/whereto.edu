"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCompareTray } from "@/context/CompareTrayContext";
import { CollegeDetailSkeleton, ReviewSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState } from "@/components/StateComponents";
import { clsx } from "clsx";

function formatFees(fees: number) {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L`;
  return `₹${(fees / 1000).toFixed(0)}K`;
}

function formatPackage(pkg: number) {
  return `₹${(pkg / 100000).toFixed(1)}L`;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={clsx("transition-transform duration-100", onChange && "hover:scale-110 cursor-pointer")}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill={value >= star ? "#E8A33D" : "none"}>
            <path
              d="M10 2l1.854 3.757L16 6.5l-3 2.921.707 4.129L10 11.25l-3.707 2.3.707-4.129L4 6.5l4.146-.743L10 2z"
              stroke="#E8A33D"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function CollegeDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { addCollege, removeCollege, isInTray, isFull } = useCompareTray();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  const id = params.id as string;
  const inTray = isInTray(Number(id));

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["college", id],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) throw new Error("College not found");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const method = data?.isSaved ? "DELETE" : "POST";
      const res = await fetch("/api/saved/colleges", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: Number(id) }),
      });
      if (!res.ok) throw new Error("Save failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-colleges"] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/colleges/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to submit review");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college", id] });
      setReviewComment("");
      setReviewError("");
    },
    onError: (err: Error) => {
      setReviewError(err.message);
    },
  });

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <CollegeDetailSkeleton />
    </div>
  );

  if (isError || !data?.data) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <ErrorState
        title="College not found"
        message="This college may have been removed or doesn't exist."
        onRetry={() => refetch()}
      />
    </div>
  );

  const college = data.data;
  const latestPlacement = college.placements?.[0];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: `Courses (${college.courses?.length ?? 0})` },
    { key: "placements", label: "Placements" },
    { key: "reviews", label: `Reviews (${college.reviews?.length ?? 0})` },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero card */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-indigo">{college.type}</span>
            <span className="badge badge-slate">Est. {college.establishedYear}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {session ? (
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                id="detail-save-btn"
                className={clsx(
                  "btn-outline gap-2 text-body-sm",
                  data?.isSaved && "border-amber-accent text-amber-accent bg-amber-pale hover:bg-amber-light/30"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill={data?.isSaved ? "currentColor" : "none"}>
                  <path d="M7 12L1.5 7.5a3.5 3.5 0 014.95-4.95L7 3.086l.55-.536A3.5 3.5 0 0112.5 7.5L7 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {data?.isSaved ? "Saved" : "Save"}
              </button>
            ) : null}
            <button
              onClick={() => inTray ? removeCollege(Number(id)) : addCollege({ id: Number(id), name: college.name, location: college.location, rating: college.rating })}
              disabled={!inTray && isFull}
              id="detail-compare-btn"
              className={clsx(
                "btn-outline text-body-sm",
                inTray && "border-amber-accent text-amber-accent bg-amber-pale"
              )}
            >
              {inTray ? "✓ In compare" : isFull ? "Compare full" : "+ Compare"}
            </button>
          </div>
        </div>

        <h1 className="font-headline text-display text-indigo-primary mb-2">{college.name}</h1>
        <p className="flex items-center gap-2 text-body text-slate-body mb-6">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5a4 4 0 014 4C11 8.5 7 12.5 7 12.5S3 8.5 3 5.5a4 4 0 014-4z" stroke="#4A5268" strokeWidth="1.2" />
            <circle cx="7" cy="5.5" r="1.5" stroke="#4A5268" strokeWidth="1.2" />
          </svg>
          {college.location}
        </p>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="stat-label">Rating</p>
            <p className="stat-value text-amber-accent">{college.rating.toFixed(1)}</p>
            <p className="text-caption text-slate-light">{college.reviews?.length ?? 0} reviews</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Fees/Year</p>
            <p className="stat-value">{formatFees(college.feesPerYear)}</p>
            <p className="text-caption text-slate-light">Per annum</p>
          </div>
          {latestPlacement && (
            <>
              <div className="stat-card">
                <p className="stat-label">Avg Package</p>
                <p className="stat-value text-green-placement">{formatPackage(latestPlacement.avgPackage)}</p>
                <p className="text-caption text-slate-light">{latestPlacement.year}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Placement Rate</p>
                <p className="stat-value text-green-placement">
                  {(latestPlacement.placementRate * 100).toFixed(0)}%
                </p>
                <p className="text-caption text-slate-light">{latestPlacement.year}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-slate-border/60">
        <nav className="flex gap-0 -mb-px overflow-x-auto" aria-label="College detail tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              id={`tab-${tab.key}`}
              className={clsx(
                "px-4 py-3 text-body-sm font-medium border-b-2 whitespace-nowrap transition-all duration-150",
                activeTab === tab.key
                  ? "border-indigo-primary text-indigo-primary"
                  : "border-transparent text-slate-light hover:text-slate-body hover:border-slate-border"
              )}
              aria-selected={activeTab === tab.key}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="card p-6">
            <h2 className="section-heading mb-4">About {college.name}</h2>
            <p className="text-body-lg text-slate-body leading-relaxed">{college.description}</p>
          </div>
        )}

        {/* Courses */}
        {activeTab === "courses" && (
          <div className="card overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="section-heading">Courses Offered</h2>
              <p className="text-body-sm text-slate-light mb-4">{college.courses?.length ?? 0} programs available</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-b border-slate-border/60 bg-surface-muted">
                    <th className="text-left px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Program</th>
                    <th className="text-right px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Duration</th>
                    <th className="text-right px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Fees/Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border/40">
                  {college.courses?.map((course: { id: number; name: string; durationYears: number; feesPerYear: number }) => (
                    <tr key={course.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-6 py-4 text-body-sm font-medium text-indigo-primary">{course.name}</td>
                      <td className="px-6 py-4 text-right font-mono-data text-mono-sm text-slate-body">
                        {course.durationYears}yr
                      </td>
                      <td className="px-6 py-4 text-right font-mono-data text-mono-sm text-indigo-primary font-semibold">
                        {formatFees(course.feesPerYear)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placements */}
        {activeTab === "placements" && (
          <div className="card overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="section-heading">Placement Statistics</h2>
              <p className="text-body-sm text-slate-light mb-4">Year-wise placement data</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-b border-slate-border/60 bg-surface-muted">
                    <th className="text-left px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Year</th>
                    <th className="text-right px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Avg Package</th>
                    <th className="text-right px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Highest Package</th>
                    <th className="text-right px-6 py-3 text-caption font-medium text-slate-light uppercase tracking-wide">Placement Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-border/40">
                  {college.placements?.map((p: { id: number; year: number; avgPackage: number; highestPackage: number; placementRate: number }) => (
                    <tr key={p.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono-data text-mono-sm font-semibold text-indigo-primary">{p.year}</td>
                      <td className="px-6 py-4 text-right font-mono-data text-mono-sm text-green-placement font-semibold">
                        {formatPackage(p.avgPackage)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono-data text-mono-sm text-indigo-primary font-semibold">
                        {formatPackage(p.highestPackage)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-20 h-1.5 bg-slate-border/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-placement rounded-full"
                              style={{ width: `${p.placementRate * 100}%` }}
                            />
                          </div>
                          <span className="font-mono-data text-mono-sm text-green-placement font-semibold w-10 text-right">
                            {(p.placementRate * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-5">
            {/* Write review */}
            {session ? (
              <div className="card p-6">
                <h3 className="text-heading-sm text-indigo-primary mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <p className="label mb-2">Your Rating</p>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <label htmlFor="review-comment" className="label">Your Review</label>
                    <textarea
                      id="review-comment"
                      rows={3}
                      placeholder="Share your experience with this college..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="input resize-none"
                      minLength={10}
                    />
                    {reviewError && (
                      <p className="text-caption text-red-500 mt-1">{reviewError}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (reviewComment.length < 10) {
                        setReviewError("Review must be at least 10 characters");
                        return;
                      }
                      reviewMutation.mutate();
                    }}
                    disabled={reviewMutation.isPending}
                    id="submit-review-btn"
                    className="btn-primary"
                  >
                    {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-5 text-center">
                <p className="text-body-sm text-slate-light mb-3">
                  <a href="/login" className="text-indigo-primary font-medium hover:underline">Sign in</a> to write a review
                </p>
              </div>
            )}

            {/* Reviews list */}
            {college.reviews?.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-body-sm text-slate-light">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {college.reviews?.map((review: {
                  id: number;
                  rating: number;
                  comment: string;
                  createdAt: string;
                  user: { id: number; name: string };
                }) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-primary/10 rounded-full flex items-center justify-center text-body-sm font-semibold text-indigo-primary">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-indigo-primary">{review.user.name}</p>
                          <p className="text-caption text-slate-light">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-body-sm text-slate-body leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
