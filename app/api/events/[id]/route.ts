import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/event";
import { deleteEvent, getEventById, updateEvent } from "@/server/events";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/events/[id]
export async function GET(request: Request, context: RouteContext) {
  try {
    // ✅ AWAIT params - CRÍTICO para Next.js 15
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID do evento não fornecido" },
        { status: 400 }
      );
    }

    const result = await getEventById(id);

    if (!(result.success && result.event)) {
      return NextResponse.json(
        { error: result.error || "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event: result.event });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id]
export async function PUT(request: Request, context: RouteContext) {
  try {
    // ✅ AWAIT params
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
        { error: "Você não tem permissão para editar eventos" },
        { status: 403 }
      );
    }

    // Parse e validar body
    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

    // Atualizar evento
    const result = await updateEvent(id, validatedData as any);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      event: result.event,
      message: "Evento atualizado com sucesso",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
export async function DELETE(request: Request, context: RouteContext) {
  try {
    // ✅ AWAIT params
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
        { error: "Você não tem permissão para deletar eventos" },
        { status: 403 }
      );
    }

    // Deletar evento
    const result = await deleteEvent(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Evento deletado com sucesso",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
