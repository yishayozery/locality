"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "./ui/Container";
import Button from "./ui/Button";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🌿</span>
            <span className="text-xl font-bold text-primary">LOCALITY</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#how-it-works" className="text-text-muted hover:text-primary transition-colors">
              איך זה עובד
            </a>
            <a href="#categories" className="text-text-muted hover:text-primary transition-colors">
              קטגוריות
            </a>
            <a href="#for-suppliers" className="text-text-muted hover:text-primary transition-colors">
              לספקים
            </a>
            <a href="#for-points" className="text-text-muted hover:text-primary transition-colors">
              לנקודות איסוף
            </a>
            <a href="#contact" className="text-text-muted hover:text-primary transition-colors">
              צור קשר
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="outline" size="sm">
              כניסה
            </Button>
            <Button variant="primary" size="sm">
              הרשמה
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="תפריט"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#how-it-works" className="text-text-muted hover:text-primary py-2" onClick={() => setMenuOpen(false)}>
                איך זה עובד
              </a>
              <a href="#categories" className="text-text-muted hover:text-primary py-2" onClick={() => setMenuOpen(false)}>
                קטגוריות
              </a>
              <a href="#for-suppliers" className="text-text-muted hover:text-primary py-2" onClick={() => setMenuOpen(false)}>
                לספקים
              </a>
              <a href="#for-points" className="text-text-muted hover:text-primary py-2" onClick={() => setMenuOpen(false)}>
                לנקודות איסוף
              </a>
              <a href="#contact" className="text-text-muted hover:text-primary py-2" onClick={() => setMenuOpen(false)}>
                צור קשר
              </a>
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Button variant="outline" size="sm" className="flex-1">
                  כניסה
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  הרשמה
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
