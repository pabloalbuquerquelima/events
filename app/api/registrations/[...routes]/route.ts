import { auth } from "@/lib/auth";
import { registerForEventSchema } from "@/lib/validations/registration";
import { getUserRegistrations, registerForEvent } from "@/server/registrations";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/registrations - Listar inscrições do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getUserRegistrations();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      registrations: result.registrations,
    });
  } catch (error) {
    console.error("Error in GET /api/registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/registrations - Criar inscrição
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
    const validatedData = registerForEventSchema.parse(body);

    const result = await registerForEvent(
      validatedData.eventId,
      validatedData.attendeesCount
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        registration: result.registration,
        waitlist: result.waitlist,
        message: result.registration
          ? "Registration successful"
          : "Added to waitlist",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/registrations:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
