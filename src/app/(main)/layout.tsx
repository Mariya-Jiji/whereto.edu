import { Navbar } from "@/components/Navbar";
import { CompareTray } from "@/components/CompareTray";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <CompareTray />
      <footer className="border-t border-slate-border/60 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-primary rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L2 3.5v6h8v-6L6 1z" stroke="#E8A33D" strokeWidth="1" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <span className="font-headline text-body-sm text-indigo-primary">
              College<span className="text-amber-accent">Disc</span>
            </span>
          </div>
          <p className="text-caption text-slate-light">
            Helping students make informed college decisions. Data updated 2024–25.
          </p>
        </div>
      </footer>
    </>
  );
}
