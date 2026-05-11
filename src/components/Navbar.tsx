import SupabaseLogo from "./SupabaseLogo";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";

function Navbar({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <SupabaseLogo />
              <span className="text-xl font-bold text-gray-900">
                Supabase Playground
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex md:items-center md:space-x-8">
              <a
                href="/data"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
                <span>Database</span>
              </a>
              <a
                href="/realtime"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Realtime</span>
              </a>
              <a
                href="/edge-functions"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span>Edge Functions</span>
              </a>
              <a
                href="/external-api"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>External API</span>
              </a>
              <a
                href="/storage"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span>Storage</span>
              </a>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <a
                  href="/profile"
                  className="hidden items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:inline-flex"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Profile</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* Mobile menu button */}
            {session && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && session && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <a
                href="/data"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Database
              </a>
              <a
                href="/realtime"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Realtime
              </a>
              <a
                href="/edge-functions"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Edge Functions
              </a>
              <a
                href="/external-api"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                External API
              </a>
              <a
                href="/storage"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Storage
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
