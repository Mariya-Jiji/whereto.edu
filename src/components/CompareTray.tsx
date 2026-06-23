"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompareTray } from "@/context/CompareTrayContext";
import { clsx } from "clsx";

export function CompareTray() {
  const { colleges, removeCollege, clearTray } = useCompareTray();
  const router = useRouter();

  if (colleges.length === 0) return null;

  const handleCompare = () => {
    const ids = colleges.map((c) => c.id).join(",");
    clearTray();
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div className="compare-tray">
      <div className="bg-indigo-primary text-white rounded-pill shadow-tray px-4 py-3 flex items-center gap-3 min-w-[320px] max-w-[520px]">
        {/* Count indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex -space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  "w-6 h-6 rounded-full border-2 border-indigo-primary flex items-center justify-center transition-all duration-300",
                  i < colleges.length ? "bg-amber-accent" : "bg-indigo-muted"
                )}
              >
                {i < colleges.length && (
                  <span className="font-mono-data text-[9px] font-bold text-indigo-primary">
                    {i + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="font-mono-data text-mono-sm font-medium text-amber-accent ml-1">
            {colleges.length}/3
          </span>
        </div>

        {/* College names */}
        <div className="flex-1 min-w-0">
          <p className="text-caption text-white/70 uppercase tracking-wide font-medium mb-0.5">
            Comparing
          </p>
          <p className="text-body-sm font-medium text-white truncate">
            {colleges.map((c) => c.name.split(" ").slice(0, 3).join(" ")).join(" · ")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {colleges.length >= 2 && (
            <button
              onClick={handleCompare}
              id="compare-tray-btn"
              className="px-4 py-1.5 bg-amber-accent text-indigo-primary font-semibold text-body-sm rounded-full 
                         hover:bg-amber-light transition-colors duration-150 active:scale-[0.97]"
            >
              Compare now
            </button>
          )}
          <button
            onClick={clearTray}
            id="compare-tray-clear"
            aria-label="Clear compare tray"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-indigo-muted transition-colors duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
