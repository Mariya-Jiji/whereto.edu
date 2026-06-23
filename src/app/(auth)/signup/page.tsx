"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setLoading(true);

    // Register
    const regRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const regData = await regRes.json();

    if (!regRes.ok) {
      setLoading(false);
      if (regRes.status === 409) {
        setGlobalError(regData.error);
      } else if (regData.issues) {
        setErrors(regData.issues as FieldErrors);
      } else {
        setGlobalError(regData.error ?? "Registration failed.");
      }
      return;
    }

    // Auto sign in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setGlobalError("Account created but sign-in failed. Please log in.");
      router.push("/login");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <div className="card p-7 sm:p-8">
        <div className="text-center mb-7">
          <h1 className="font-headline text-display text-indigo-primary mb-1">Create account</h1>
          <p className="text-body-sm text-slate-light">Start shortlisting your ideal college</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {globalError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-body-sm">
              {globalError}
            </div>
          )}

          <div>
            <label htmlFor="signup-name" className="label">Full name</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              className={`input ${errors.name ? "border-red-400" : ""}`}
            />
            {errors.name && <p className="text-caption text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="label">Email address</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`input ${errors.email ? "border-red-400" : ""}`}
            />
            {errors.email && <p className="text-caption text-red-500 mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="label">Password</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters, 1 uppercase, 1 number"
              className={`input ${errors.password ? "border-red-400" : ""}`}
            />
            {errors.password && <p className="text-caption text-red-500 mt-1">{errors.password[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            id="signup-submit-btn"
            className="btn-amber w-full justify-center py-3 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-body-sm text-slate-light mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-primary font-medium hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
