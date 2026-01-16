import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations/event";
import { createEvent, getEvents } from "@/server/events";

// GET /api/events - Listar eventos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;
    const upcoming = searchParams.get("upcoming") === "true";
    const past = searchParams.get("past") === "true";
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    const result = await getEvents({
      status,
      category,
      upcoming,
      past,
      limit,
      offset,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      events: result.events,
      total: result.events.length,
    });
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/events - Criar evento
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validar dados
    const validatedData = createEventSchema.parse(body);

    const result = await createEvent({
      ...validatedData,
      currentAttendees: 0,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        event: result.event,
        message: "Event created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
  
}

