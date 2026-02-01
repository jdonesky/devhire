"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Dev<span className="text-blue-600">Hire</span>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/jobs"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Browse Jobs
            </Link>
            {session?.user?.role === "EMPLOYER" && (
              <Link
                href="/employer"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Employer Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
