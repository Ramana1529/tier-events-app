import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = auth();

  const { newTier } = await req.json();

  if (!userId || !["free", "silver", "gold", "platinum"].includes(newTier)) {
    return new Response("Invalid", { status: 400 });
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      tier: newTier,
    },
  });

  return new Response("Tier updated", { status: 200 });
}
