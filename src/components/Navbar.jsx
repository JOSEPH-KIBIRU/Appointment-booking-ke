"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { user, userProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/businesses", label: "Find Services" },
    { href: "/why-choose-us", label: "Why Choose Us" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="bg-gray-950 dark:bg-gray-900 text-white border-b border-gray-800 dark:border-gray-700 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
                L
              </div>
              <div className="font-bold text-xl tracking-tight dark:text-white">
                una<span className="text-emerald-400">Pay</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors text-sm dark:text-gray-300"
                >
                  {link.label}
                </Link>
              ))}

              {/* Business Dashboard Link */}
              {user && userProfile?.role === "business" && (
                <Link
                  href="/business/dashboard"
                  className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* 🔥 ADMIN DASHBOARD LINK - FIXED */}
              {user && userProfile?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <span>👑</span>
                  Admin
                </Link>
              )}
            </div>

            {/* Auth Area + Theme Toggle */}
            <div className="hidden md:flex items-center gap-5">
              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              )}

              {user ? (
                <>
                  <span className="text-gray-300 dark:text-gray-400">
                    Hi, {userProfile?.full_name?.split(" ")[0] || "User"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors dark:text-gray-300"
                  >
                    Sign In
                  </button>
                  <Link
                    href="/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <button className="md:hidden text-white" onClick={toggleMenu}>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-950 dark:bg-gray-900 border-t border-gray-800 dark:border-gray-700 text-white">
            <div className="px-4 py-5 space-y-4">
              {/* Mobile Theme Toggle */}
              {mounted && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-800 dark:border-gray-700">
                  <span className="text-gray-300 dark:text-gray-400">
                    Theme
                  </span>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700"
                  >
                    {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                  </button>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block hover:text-emerald-400 dark:hover:text-emerald-400"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}

              {/* Business Dashboard Link - Mobile */}
              {user && userProfile?.role === "business" && (
                <Link
                  href="/business/dashboard"
                  className="block text-emerald-400"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              )}

              {/* 🔥 ADMIN DASHBOARD LINK - Mobile */}
              {user && userProfile?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="block text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                  onClick={toggleMenu}
                >
                  <span className="inline-flex items-center gap-1">
                    <span>👑</span>
                    Admin Dashboard
                  </span>
                </Link>
              )}

              <div className="pt-4 border-t border-gray-800 dark:border-gray-700">
                {user ? (
                  <>
                    <div className="text-gray-300 dark:text-gray-400 mb-3">
                      Hi, {userProfile?.full_name?.split(" ")[0] || "User"}
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      disabled={isSigningOut}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:opacity-50"
                    >
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        toggleMenu();
                      }}
                      className="w-full text-left hover:text-emerald-400 dark:hover:text-emerald-400 py-3 dark:text-gray-300"
                    >
                      Sign In
                    </button>
                    <Link
                      href="/register"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg mt-3 text-center"
                      onClick={toggleMenu}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
