// Loading skeleton components for all async views

export function CollegeCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton w-8 h-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-3/5 rounded" />
      </div>
      <div className="skeleton h-4 w-24 rounded" />
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-border/50">
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
        <div className="space-y-1">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-5 w-20 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-8 rounded" />
        </div>
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>
      <div className="skeleton h-9 w-full rounded-lg" />
    </div>
  );
}

export function CollegeGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CollegeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CollegeDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="card p-8 space-y-4">
        <div className="flex items-start justify-between">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-5 w-1/2 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-6 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Courses table */}
      <div className="card p-6 space-y-4">
        <div className="skeleton h-6 w-40 rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 w-full rounded" />)}
        </div>
      </div>
    </div>
  );
}

export function CompareTableSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-slate-border/60">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 space-y-3">
            <div className="skeleton h-5 w-20 rounded-full" />
            <div className="skeleton h-6 w-4/5 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="space-y-2 pt-4">
              {[1, 2, 3, 4, 5].map((j) => <div key={j} className="skeleton h-5 w-full rounded" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}
