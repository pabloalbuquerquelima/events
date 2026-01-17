import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventRegistrations } from "@/server/registrations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/events/[id]/participants
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do evento não fornecido" },
        { status: 400 }
      );
    }

    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verificar se é admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Você não tem permissão para visualizar participantes" },
        { status: 403 }
      );
    }

    // Buscar registrations com dados dos participantes
    const result = await getEventRegistrations(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      registrations: result.registrations,
      total: result.registrations.length,
    });
  } catch (error: any) {
    console.error("Error in GET /api/events/[id]/participants:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
