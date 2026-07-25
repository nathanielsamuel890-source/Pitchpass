// Clerk calls this URL automatically whenever someone signs up (or other
// account events happen, depending on what's subscribed to in the Clerk
// dashboard). We verify the request really came from Clerk (using the
// signing secret), then push a free phone notification via ntfy.sh —
// https://ntfy.sh has no account/app-registration needed: whatever "topic"
// name you pick here is also what you subscribe to in the ntfy app.

import { Webhook } from "svix";

// Vercel needs the RAW request body to verify the signature — turning off
// its automatic JSON parsing so we can read the exact bytes Clerk sent.
export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  const ntfyTopic = process.env.NTFY_TOPIC;

  if (!secret || !ntfyTopic) {
    return res.status(500).json({
      error: "Missing CLERK_WEBHOOK_SECRET or NTFY_TOPIC env vars in Vercel.",
    });
  }

  const rawBody = await readRawBody(req);

  const svixId = req.headers["svix-id"];
  const svixTimestamp = req.headers["svix-timestamp"];
  const svixSignature = req.headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Missing svix headers" });
  }

  let event;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    // Signature didn't match — request did NOT really come from Clerk.
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  if (event.type === "user.created") {
    const email = event.data?.email_addresses?.[0]?.email_address ?? "unknown email";
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: "POST",
        headers: { Title: "New PitchPass signup" },
        body: `New signup: ${email}`,
      });
    } catch {
      // Don't fail the webhook response to Clerk just because the push failed.
    }
  }

  return res.status(200).json({ received: true });
}
