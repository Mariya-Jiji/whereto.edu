"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      {/* Card */}
      <div className="card p-7 sm:p-8">
        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="font-headline text-display text-indigo-primary mb-1">Welcome back</h1>
          <p className="text-body-sm text-slate-light">Sign in to your account</p>
        </div>

        {/* Demo hint */}
        <div className="bg-amber-pale border border-amber-accent/30 rounded-lg px-4 py-3 mb-6">
          <p className="text-caption text-slate-body">
            <strong className="text-indigo-primary">Demo account:</strong>{" "}
            <span className="font-mono-data">demo@collegedisc.in</span> /{" "}
            <span className="font-mono-data">Demo@1234</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-body-sm"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="label">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="label">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-body-sm text-slate-light mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-primary font-medium hover:underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
