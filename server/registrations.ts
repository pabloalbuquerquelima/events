"use server";

import { db } from "@/db/index.";
import { event, registration, waitlist } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

// ==========================================
// HELPERS
// ==========================================

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
}

async function isAdmin() {
  try {
    const { success } = await auth.api.userHasPermission({
      headers: await headers(),
      body: {
        permissions: {
          organization: ["update", "delete"],
        },
      },
    });
    return success;
  } catch {
    return false;
  }
}

async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0056a3", // Azul SEDUC
        light: "#FFFFFF",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

// ==========================================
// QUERIES - Buscar Inscrições
// ==========================================

export async function getUserRegistrations() {
  try {
    const user = await getCurrentUser();

    const userRegistrations = await db.query.registration.findMany({
      where: eq(registration.userId, user.id),
      with: {
        event: true,
      },
      orderBy: [desc(registration.createdAt)],
    });

    return {
      success: true,
      registrations: userRegistrations,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return {
      success: false,
      registrations: [],
      error: "Failed to fetch registrations.",
    };
  }
}

export async function getEventRegistrations(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        registrations: [],
        error: "You are not authorized to view registrations.",
      };
    }

    const eventRegistrations = await db.query.registration.findMany({
      where: eq(registration.eventId, eventId),
      with: {
        user: true,
      },
      orderBy: [asc(registration.createdAt)],
    });

    return {
      success: true,
      registrations: eventRegistrations,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return {
      success: false,
      registrations: [],
      error: "Failed to fetch registrations.",
    };
  }
}

export async function getRegistrationById(registrationId: string) {
  try {
    const user = await getCurrentUser();

    const registrationData = await db.query.registration.findFirst({
      where: eq(registration.id, registrationId),
      with: {
        event: true,
        user: true,
      },
    });

    if (!registrationData) {
      return {
        success: false,
        registration: null,
        error: "Registration not found.",
      };
    }

    // Verificar se é admin ou o dono da inscrição
    const admin = await isAdmin();
    if (!admin && registrationData.userId !== user.id) {
      return {
        success: false,
        registration: null,
        error: "You are not authorized to view this registration.",
      };
    }

    return {
      success: true,
      registration: registrationData,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching registration:", error);
    return {
      success: false,
      registration: null,
      error: "Failed to fetch registration.",
    };
  }
}

export async function checkUserRegistration(eventId: string) {
  try {
    const user = await getCurrentUser();

    const existingRegistration = await db.query.registration.findFirst({
      where: and(
        eq(registration.eventId, eventId),
        eq(registration.userId, user.id)
      ),
    });

    const existingWaitlist = await db.query.waitlist.findFirst({
      where: and(eq(waitlist.eventId, eventId), eq(waitlist.userId, user.id)),
    });

    return {
      success: true,
      isRegistered: !!existingRegistration,
      isOnWaitlist: !!existingWaitlist,
      registration: existingRegistration,
      waitlist: existingWaitlist,
      error: null,
    };
  } catch (error) {
    console.error("Error checking user registration:", error);
    return {
      success: false,
      isRegistered: false,
      isOnWaitlist: false,
      registration: null,
      waitlist: null,
      error: "Failed to check registration status.",
    };
  }
}

// ==========================================
// MUTATIONS - Criar/Cancelar Inscrições
// ==========================================

export async function registerForEvent(eventId: string, attendeesCount = 1) {
  try {
    const user = await getCurrentUser();

    // Verificar se o evento existe
    const eventData = await db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!eventData) {
      return {
        success: false,
        registration: null,
        waitlist: null,
        error: "Event not found.",
      };
    }

    // Verificar se o evento está publicado
    if (eventData.status !== "published") {
      return {
        success: false,
        registration: null,
        waitlist: null,
        error: "Event is not available for registration.",
      };
    }

    // Verificar se já está inscrito
    const existingRegistration = await db.query.registration.findFirst({
      where: and(
        eq(registration.eventId, eventId),
        eq(registration.userId, user.id)
      ),
    });

    if (existingRegistration) {
      return {
        success: false,
        registration: null,
        waitlist: null,
        error: "You are already registered for this event.",
      };
    }

    // Verificar se já está na lista de espera
    const existingWaitlist = await db.query.waitlist.findFirst({
      where: and(eq(waitlist.eventId, eventId), eq(waitlist.userId, user.id)),
    });

    if (existingWaitlist) {
      return {
        success: false,
        registration: null,
        waitlist: null,
        error: "You are already on the waitlist for this event.",
      };
    }

    // Verificar vagas disponíveis
    const availableSpots = eventData.maxAttendees - eventData.currentAttendees;

    if (availableSpots >= attendeesCount) {
      // Há vagas disponíveis - criar inscrição
      const qrCodeData = `${eventId}:${user.id}:${Date.now()}`;
      const qrCode = await generateQRCode(qrCodeData);

      const newRegistration = await db
        .insert(registration)
        .values({
          eventId,
          userId: user.id,
          attendeesCount,
          status: "confirmed",
          qrCode,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Atualizar contador de participantes
      await db
        .update(event)
        .set({
          currentAttendees: sql`${event.currentAttendees} + ${attendeesCount}`,
        })
        .where(eq(event.id, eventId));

      // TODO: Enviar email de confirmação com QR code

      return {
        success: true,
        registration: newRegistration[0],
        waitlist: null,
        error: null,
      };
    }
    // Sem vagas - adicionar à lista de espera
    const currentWaitlistCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.eventId, eventId));

    const position = currentWaitlistCount[0].count + 1;

    const newWaitlist = await db
      .insert(waitlist)
      .values({
        eventId,
        userId: user.id,
        position,
        createdAt: new Date(),
      })
      .returning();

    // TODO: Enviar email informando posição na lista

    return {
      success: true,
      registration: null,
      waitlist: newWaitlist[0],
      error: null,
    };
  } catch (error) {
    console.error("Error registering for event:", error);
    return {
      success: false,
      registration: null,
      waitlist: null,
      error: "Failed to register for event.",
    };
  }
}

export async function cancelRegistration(registrationId: string) {
  try {
    const user = await getCurrentUser();

    // Buscar a inscrição
    const registrationData = await db.query.registration.findFirst({
      where: eq(registration.id, registrationId),
      with: {
        event: true,
      },
    });

    if (!registrationData) {
      return {
        success: false,
        error: "Registration not found.",
      };
    }

    // Verificar se é o dono da inscrição
    if (registrationData.userId !== user.id) {
      return {
        success: false,
        error: "You are not authorized to cancel this registration.",
      };
    }

    // Verificar se o evento já passou
    if (new Date(registrationData.event.endDate) < new Date()) {
      return {
        success: false,
        error: "Cannot cancel registration for past events.",
      };
    }

    // Cancelar inscrição
    await db
      .update(registration)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(registration.id, registrationId));

    // Decrementar contador de participantes
    await db
      .update(event)
      .set({
        currentAttendees: sql`${event.currentAttendees} - ${registrationData.attendeesCount}`,
      })
      .where(eq(event.id, registrationData.eventId));

    // Verificar se há alguém na lista de espera
    const firstInWaitlist = await db.query.waitlist.findFirst({
      where: eq(waitlist.eventId, registrationData.eventId),
      orderBy: [asc(waitlist.position)],
      with: {
        user: true,
      },
    });

    if (firstInWaitlist) {
      // Promover primeira pessoa da waitlist
      const qrCodeData = `${registrationData.eventId}:${firstInWaitlist.userId}:${Date.now()}`;
      const qrCode = await generateQRCode(qrCodeData);

      await db.insert(registration).values({
        eventId: registrationData.eventId,
        userId: firstInWaitlist.userId,
        attendeesCount: 1,
        status: "confirmed",
        qrCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Remover da waitlist
      await db.delete(waitlist).where(eq(waitlist.id, firstInWaitlist.id));

      // Atualizar posições na waitlist
      await db.execute(
        sql`UPDATE ${waitlist} 
            SET position = position - 1 
            WHERE event_id = ${registrationData.eventId} 
            AND position > ${firstInWaitlist.position}`
      );

      // TODO: Enviar email para a pessoa promovida
    }

    // TODO: Enviar email de confirmação de cancelamento

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return {
      success: false,
      error: "Failed to cancel registration.",
    };
  }
}

export async function removeFromWaitlist(waitlistId: string) {
  try {
    const user = await getCurrentUser();

    // Buscar waitlist
    const waitlistData = await db.query.waitlist.findFirst({
      where: eq(waitlist.id, waitlistId),
    });

    if (!waitlistData) {
      return {
        success: false,
        error: "Waitlist entry not found.",
      };
    }

    // Verificar se é o dono
    if (waitlistData.userId !== user.id) {
      return {
        success: false,
        error: "You are not authorized to remove this waitlist entry.",
      };
    }

    // Remover da waitlist
    await db.delete(waitlist).where(eq(waitlist.id, waitlistId));

    // Atualizar posições
    await db.execute(
      sql`UPDATE ${waitlist} 
          SET position = position - 1 
          WHERE event_id = ${waitlistData.eventId} 
          AND position > ${waitlistData.position}`
    );

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error removing from waitlist:", error);
    return {
      success: false,
      error: "Failed to remove from waitlist.",
    };
  }
}

// ==========================================
// CHECK-IN
// ==========================================

export async function checkInRegistration(registrationId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "You are not authorized to perform check-ins.",
      };
    }

    const registrationData = await db.query.registration.findFirst({
      where: eq(registration.id, registrationId),
    });

    if (!registrationData) {
      return {
        success: false,
        error: "Registration not found.",
      };
    }

    if (registrationData.status === "attended") {
      return {
        success: false,
        error: "User has already checked in.",
      };
    }

    await db
      .update(registration)
      .set({
        status: "attended",
        checkedInAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(registration.id, registrationId));

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error checking in registration:", error);
    return {
      success: false,
      error: "Failed to check in registration.",
    };
  }
}

export async function verifyQRCode(qrData: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        registration: null,
        error: "You are not authorized to verify QR codes.",
      };
    }

    const registrationData = await db.query.registration.findFirst({
      where: eq(registration.qrCode, qrData),
      with: {
        event: true,
        user: true,
      },
    });

    if (!registrationData) {
      return {
        success: false,
        registration: null,
        error: "Invalid QR code.",
      };
    }

    return {
      success: true,
      registration: registrationData,
      error: null,
    };
  } catch (error) {
    console.error("Error verifying QR code:", error);
    return {
      success: false,
      registration: null,
      error: "Failed to verify QR code.",
    };
  }
}

// ==========================================
// ESTATÍSTICAS
// ==========================================

export async function getUserRegistrationStats() {
  try {
    const user = await getCurrentUser();

    const totalRegistrations = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration)
      .where(eq(registration.userId, user.id));

    const attended = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration)
      .where(
        and(
          eq(registration.userId, user.id),
          eq(registration.status, "attended")
        )
      );

    const confirmed = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration)
      .where(
        and(
          eq(registration.userId, user.id),
          eq(registration.status, "confirmed")
        )
      );

    const waitlistCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.userId, user.id));

    const stats = {
      totalRegistrations: totalRegistrations[0].count,
      attended: attended[0].count,
      confirmed: confirmed[0].count,
      waitlist: waitlistCount[0].count,
    };

    return {
      success: true,
      stats,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user registration stats:", error);
    return {
      success: false,
      stats: null,
      error: "Failed to fetch stats.",
    };
  }
}
