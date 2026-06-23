export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex items-center gap-2 w-fit group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whereto_edu_logo.png" alt="Whereto.edu" width={28} height={28} className="rounded-md" />
          <span className="font-headline text-body text-indigo-primary group-hover:text-indigo-light transition-colors">
            Whereto<span className="text-amber-accent">.edu</span>
          </span>
        </a>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-caption text-slate-light">
          Helping students make informed college decisions.
        </p>
      </footer>
    </div>
  );
}
