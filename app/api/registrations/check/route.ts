import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUserRegistration } from "@/server/registrations";

// POST /api/registrations/check - Verificar se usuário está inscrito
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const result = await checkUserRegistration(eventId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      isRegistered: result.isRegistered,
      isOnWaitlist: result.isOnWaitlist,
      registration: result.registration,
      waitlist: result.waitlist,
    });
  } catch (error) {
    console.error("Error in POST /api/registrations/check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
