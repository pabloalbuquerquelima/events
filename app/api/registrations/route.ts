import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRegistrations, registerForEvent } from "@/server/registrations";

// GET /api/registrations
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const result = await getUserRegistrations();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ registrations: result.registrations });
  } catch (error: any) {
    console.error("Error in GET /api/registrations:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST /api/registrations
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, attendeesCount = 1, participantData } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID é obrigatório" },
        { status: 400 }
      );
    }

    if (!participantData) {
      return NextResponse.json(
        { error: "Dados do participante são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar campos obrigatórios
    const requiredFields = [
      "name",
      "cpf",
      "municipality",
      "state",
      "contact",
      "email",
    ];
    for (const field of requiredFields) {
      if (!participantData[field]) {
        return NextResponse.json(
          { error: `${field} é obrigatório` },
          { status: 400 }
        );
      }
    }

    const result = await registerForEvent(
      eventId,
      attendeesCount,
      participantData
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        registration: result.registration,
        waitlist: result.waitlist,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/registrations:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
