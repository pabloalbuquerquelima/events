import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  cancelRegistration,
  getRegistrationById,
} from "@/server/registrations";

type RouteContext = {
  params: Promise<{ id: string }>; // ✅ Promise no Next.js 15
};

// GET /api/registrations/[id]
export async function GET(request: Request, context: RouteContext) {
  try {
    // ✅ AWAIT params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da inscrição não fornecido" },
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

    const result = await getRegistrationById(id);

    if (!(result.success && result.registration)) {
      return NextResponse.json(
        { error: result.error || "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ registration: result.registration });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/registrations/[id] - Cancelar inscrição
export async function DELETE(request: Request, context: RouteContext) {
  try {
    // ✅ AWAIT params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da inscrição não fornecido" },
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

    const result = await cancelRegistration(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Inscrição cancelada com sucesso",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
