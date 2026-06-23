"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { CollegeCard } from "@/components/CollegeCard";
import { Pagination } from "@/components/Pagination";
import { CollegeGridSkeleton } from "@/components/LoadingSkeletons";
import { ErrorState, EmptyState } from "@/components/StateComponents";

interface CollegesResponse {
  data: Array<{
    id: number;
    name: string;
    location: string;
    feesPerYear: number;
    rating: number;
    type: string;
    establishedYear: number;
    _count: { courses: number; reviews: number };
    placements: Array<{ avgPackage: number; placementRate: number; year: number }>;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

function CollegeListingContent() {
  const searchParams = useSearchParams();

  const queryKey = ["colleges", searchParams.toString()];

  const { data, isLoading, isError, refetch } = useQuery<CollegesResponse>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/colleges?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");
      return res.json();
    },
  });

  return (
    <div>
      {isLoading ? (
        <CollegeGridSkeleton count={9} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load colleges"
          message="There was a problem fetching the college list."
          onRetry={() => refetch()}
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="No colleges found"
          message="No colleges match your current filters. Try broadening your search."
          action={{ label: "Clear filters", href: "/" }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {data?.data.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              totalCount={data.pagination.totalCount}
              pageSize={data.pagination.pageSize}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-headline text-display text-indigo-primary mb-2">
          Find Your College
        </h1>
        <p className="text-body-lg text-slate-body max-w-2xl">
          Browse {" "}
          <span className="font-mono-data text-mono font-semibold text-amber-accent">35+</span>{" "}
          premier Indian colleges — filter by location, fees, and ratings to make an informed decision.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 xl:w-72 shrink-0">
          <div className="sticky top-24">
            <div className="card p-5">
              <h2 className="text-heading-sm text-indigo-primary mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5 8h6M7 12h2" stroke="#1E2A4A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filters
              </h2>
              <Suspense fallback={<div className="skeleton h-48 rounded-lg" />}>
                <FilterBar />
              </Suspense>
            </div>
          </div>
        </aside>

        {/* College grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<CollegeGridSkeleton count={9} />}>
            <CollegeListingContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
