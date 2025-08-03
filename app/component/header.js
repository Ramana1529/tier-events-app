// app/components/Header.js
"use client";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-gray-100 shadow">
      <nav className="flex gap-4 items-center">
        <Link href="/" className="text-blue-600 font-medium hover:underline">
          Home
        </Link>
        <Link href="/events" className="text-blue-600 font-medium hover:underline">
          Events
        </Link>
      </nav>
      <SignOutButton>
        <button className="text-red-500 hover:underline">Sign out</button>
      </SignOutButton>
    </header>
  );
}
