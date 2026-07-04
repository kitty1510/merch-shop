import { NextRequest, NextResponse } from "next/server";

// In-memory event log
const events: {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userAgent?: string;
}[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data, timestamp } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ success: false, message: "Invalid event" }, { status: 400 });
    }

    const entry = {
      event,
      data: data ?? {},
      timestamp: timestamp ?? new Date().toISOString(),
      userAgent: req.headers.get("user-agent") ?? undefined,
    };

    events.push(entry);
    console.log(`[Behavior] ${entry.event}`, entry.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    totalEvents: events.length,
    recentEvents: events.slice(-20),
  });
}
