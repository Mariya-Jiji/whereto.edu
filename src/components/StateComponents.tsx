// Error and Empty state components

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#DC2626" strokeWidth="1.5" />
          <path d="M14 8v7M14 18v2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-heading-sm text-indigo-primary mb-2">{title}</h3>
      <p className="text-body-sm text-slate-light max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({
  title = "No results found",
  message = "Try adjusting your search or filters.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="13" cy="13" r="8" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M19 19l6 6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 13h6M13 10v6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-heading-sm text-indigo-primary mb-2">{title}</h3>
      <p className="text-body-sm text-slate-light max-w-sm mb-4">{message}</p>
      {action && (
        action.href ? (
          <a href={action.href} className="btn-outline">
            {action.label}
          </a>
        ) : (
          <button onClick={action.onClick} className="btn-outline">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

export function AuthPrompt({ action = "save colleges" }: { action?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 bg-amber-pale rounded-full flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="11" rx="2" stroke="#E8A33D" strokeWidth="1.5" />
          <path d="M8 11V7a4 4 0 118 0v4" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-heading-sm text-indigo-primary mb-2">Sign in to {action}</h3>
      <p className="text-body-sm text-slate-light max-w-xs mb-4">
        Create a free account to save your shortlisted colleges and comparisons.
      </p>
      <div className="flex gap-3">
        <a href="/login" className="btn-outline">Sign in</a>
        <a href="/signup" className="btn-amber">Create account</a>
      </div>
    </div>
  );
}
