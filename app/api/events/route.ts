import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations/event";
import { createEvent, getEvents } from "@/server/events";

// GET /api/events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await getEvents({
      status: searchParams.get("status") || undefined,
      category: searchParams.get("category") || undefined,
      upcoming: searchParams.get("upcoming") === "true",
      past: searchParams.get("past") === "true",
      limit: Number(searchParams.get("limit")) || 10,
      offset: Number(searchParams.get("offset")) || 0,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: Request) {
  try {
    // 1. Pegar sessão
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // 2. Verificar se é admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Você não é admin" }, { status: 403 });
    }

    // 3. Parse body
    const body = await request.json();

    // 4. Validar
    const validatedData = createEventSchema.parse(body);

    // 5. Criar evento
    const result = await createEvent(validatedData as any);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erro no servidor" },
      { status: 500 }
    );
  }
}
