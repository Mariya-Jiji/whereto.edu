"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export function Pagination({ page, totalPages, totalCount, pageSize }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers with ellipsis
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-body-sm text-slate-light">
        Showing <span className="font-mono-data font-medium text-indigo-primary">{start}–{end}</span> of{" "}
        <span className="font-mono-data font-medium text-indigo-primary">{totalCount}</span> colleges
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          id="pagination-prev"
          className={clsx(
            "w-9 h-9 rounded-lg flex items-center justify-center border text-body-sm transition-all duration-150",
            page <= 1
              ? "border-slate-border/40 text-slate-light opacity-50 cursor-not-allowed"
              : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
          )}
          aria-label="Previous page"
        >
          ‹
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-light text-body-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goTo(p)}
              id={`pagination-page-${p}`}
              className={clsx(
                "w-9 h-9 rounded-lg flex items-center justify-center border font-mono-data text-mono-sm transition-all duration-150",
                p === page
                  ? "border-indigo-primary bg-indigo-primary text-white"
                  : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
              )}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          id="pagination-next"
          className={clsx(
            "w-9 h-9 rounded-lg flex items-center justify-center border text-body-sm transition-all duration-150",
            page >= totalPages
              ? "border-slate-border/40 text-slate-light opacity-50 cursor-not-allowed"
              : "border-slate-border text-slate-body hover:border-indigo-primary hover:text-indigo-primary"
          )}
          aria-label="Next page"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
