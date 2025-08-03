"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const TIER_OPTIONS = ["free", "silver", "gold", "platinum"];

export default function AdminPage() {
  const { user } = useUser();
  useEffect(() => {
    console.log("Logged in as:", user?.primaryEmailAddress?.emailAddress);
    console.log("isAdmin value:", user?.publicMetadata?.isAdmin);
  }, [user]);
  
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tier: "free",
    image: null,
  });

  useEffect(() => {
    // Only allow access if admin
    const isAdmin = user?.publicMetadata?.isAdmin === "true";
    if (!isAdmin) {
      alert("You are not authorized to access this page.");
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    if (!error) setEvents(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Upload image first if available
    let imageUrl = null;
    if (form.image) {
      const fileExt = form.image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, form.image);

      if (uploadError) {
        alert("Image upload failed");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("events").insert([
      {
        title: form.title,
        description: form.description,
        tier: form.tier,
        image_url: imageUrl,
      },
    ]);

    if (!error) {
      alert("Event created!");
      setForm({ title: "", description: "", tier: "free", image: null });
      fetchEvents();
    } else {
      alert("Error creating event");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={form.tier}
          onChange={(e) => setForm({ ...form, tier: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          {TIER_OPTIONS.map((tier) => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Event
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-2">All Events</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500">{event.tier}</p>
            {event.image_url && (
              <img src={event.image_url} alt={event.title} className="mt-2 w-full max-h-48 object-cover rounded" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
