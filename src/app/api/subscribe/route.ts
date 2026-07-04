import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

// In-memory store (reset on server restart; replace with DB for production)
const subscribers: { name: string; email: string; subscribedAt: string }[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Prevent duplicate emails
    const existing = subscribers.find((s) => s.email === email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed." },
        { status: 409 }
      );
    }

    subscribers.push({ name, email, subscribedAt: new Date().toISOString() });

    // Forward to external webhook if configured
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, source: "merch-shop-newsletter" }),
        });
      } catch {
        // Webhook forwarding failed – non-critical, continue
        console.warn("Webhook forwarding failed");
      }
    }

    console.log(`[Subscribe] New subscriber: ${name} <${email}>`);

    return NextResponse.json({
      success: true,
      message: `Thanks, ${name}! You're on the list.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return subscriber count (don't expose emails)
  return NextResponse.json({ count: subscribers.length });
}
