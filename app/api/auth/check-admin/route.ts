import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session) {
      return NextResponse.json({ isAdmin: false });
    }

    // Verificar se a role no cookie da sessão é admin ou owner
    const role = (session.session as any).role;
    const isAdmin = role === "admin" || role === "owner";

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
