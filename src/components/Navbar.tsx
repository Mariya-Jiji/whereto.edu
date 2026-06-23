"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCompareTray } from "@/context/CompareTrayContext";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { colleges } = useCompareTray();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-border/60 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" id="navbar-logo">
          <Image
            src="/whereto_edu_logo.png"
            alt="Whereto.edu logo"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <span className="font-headline text-heading-sm text-indigo-primary">
            Whereto<span className="text-amber-accent">.edu</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Link href="/" className="btn-ghost text-body-sm" id="nav-home">
            Browse Colleges
          </Link>
          <Link href="/compare" className="btn-ghost text-body-sm relative" id="nav-compare">
            Compare
            {colleges.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-accent text-indigo-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {colleges.length}
              </span>
            )}
          </Link>
          {session && (
            <Link href="/saved" className="btn-ghost text-body-sm" id="nav-saved">
              Saved
            </Link>
          )}
        </nav>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-body-sm text-slate-body">
                Hi, <strong className="text-indigo-primary">{session.user?.name?.split(" ")[0]}</strong>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                id="navbar-signout"
                className="btn-outline text-body-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-body-sm" id="navbar-login">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary text-body-sm" id="navbar-signup">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          id="navbar-mobile-toggle"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-0.5 bg-indigo-primary transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-0.5 bg-indigo-primary transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-indigo-primary transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-border/60 bg-white px-4 py-3 flex flex-col gap-1 animate-fade-in">
          <Link href="/" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Browse Colleges</Link>
          <Link href="/compare" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Compare</Link>
          {session && <Link href="/saved" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Saved Items</Link>}
          <div className="divider my-1" />
          {session ? (
            <button
              onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
              className="btn-ghost justify-start text-left"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-ghost justify-start" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/signup" className="btn-primary justify-start" onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
