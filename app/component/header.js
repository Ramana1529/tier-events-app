"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">
        <Link href="/">Tier Events</Link>
      </h1>

      <div className="flex gap-4 items-center">
        <SignedIn>
          <Link href="/events" className="text-blue-600 hover:underline font-medium">
            Events
          </Link>

          <UserButton afterSignOutUrl="/" />
          
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
