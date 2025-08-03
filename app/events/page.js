"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TIER_ORDER = ["free", "silver", "gold", "platinum"];

export default function EventsPage() {
  const { user, isLoaded } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const userTier = user.publicMetadata?.tier || "free";
    const userTierIndex = TIER_ORDER.indexOf(userTier);

    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (!error) {
        setEvents(
          data.map((event) => ({
            ...event,
            isLocked: TIER_ORDER.indexOf(event.tier) > userTierIndex,
          }))
        );
      } else {
        console.error("Supabase error:", error.message);
      }

      setLoading(false);
    }

    fetchEvents();
  }, [user, isLoaded]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <SignOutButton>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <li
              key={event.id}
              className={`relative border p-4 rounded shadow transition ${
                event.isLocked ? "opacity-50 blur-sm" : ""
              }`}
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">{event.tier.toUpperCase()}</p>

              {event.isLocked && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur flex items-center justify-center text-center px-2">
                  <p className="text-red-600 font-semibold">
                    Upgrade to {event.tier.toUpperCase()} to unlock 🔒
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {user?.primaryEmailAddress?.emailAddress === "admin@example.com" && (
  <a
    href="/admin"
    className="ml-4 text-blue-600 hover:underline"
  >
    Admin Panel
  </a>
)}

      {isLoaded && user && (
        <div className="mt-8 text-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={async () => {
              const newTier = prompt("Enter new tier: free, silver, gold, platinum")?.toLowerCase();

              if (!TIER_ORDER.includes(newTier)) {
                alert("Invalid tier.");
                return;
              }

              await user.update({
                unsafeMetadata: { tier: newTier },
              });

              alert(`Tier upgraded to ${newTier}. Reloading...`);
              location.reload();
            }}
          >
            Simulate Tier Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
