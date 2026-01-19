"use server";

import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/index.";
import type { NewEvent } from "@/db/schema";
import { event, registration, waitlist } from "@/db/schema";
import { auth } from "@/lib/auth";

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
    const user = await getCurrentUser();
    return user.role === "admin";
  } catch {
    return false;
  }
}

export async function getEvents(filters?: {
  status?: string;
  category?: string;
  upcoming?: boolean;
  past?: boolean;
  limit?: number;
  offset?: number;
}) {
  try {
    const now = new Date();

    let query = db.select().from(event);
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(event.status, filters.status as any));
    }

    if (filters?.category) {
      conditions.push(eq(event.category, filters.category as any));
    }

    if (filters?.upcoming) {
      conditions.push(gte(event.startDate, now));
    }

    if (filters?.past) {
      conditions.push(lte(event.endDate, now));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(event.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    const events = await query;

    return {
      success: true,
      events,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return {
      success: false,
      events: [],
      error: "Falha ao buscar eventos.",
    };
  }
}

export async function getEventById(eventId: string) {
  try {
    const eventData = await db.query.event.findFirst({
      where: eq(event.id, eventId),
      with: {
        creator: true,
        registrations: {
          with: {
            user: true,
          },
        },
        waitlist: {
          with: {
            user: true,
          },
          orderBy: [asc(waitlist.position)],
        },
      },
    });

    if (!eventData) {
      return {
        success: false,
        event: null,
        error: "Evento não encontrado.",
      };
    }

    return {
      success: true,
      event: eventData,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return {
      success: false,
      event: null,
      error: "Falha ao buscar evento.",
    };
  }
}

export async function getFeaturedEvents() {
  try {
    const now = new Date();

    const events = await db
      .select()
      .from(event)
      .where(and(eq(event.status, "published"), gte(event.startDate, now)))
      .orderBy(asc(event.startDate))
      .limit(6);

    return {
      success: true,
      events,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos em destaque:", error);
    return {
      success: false,
      events: [],
      error: "Falha ao buscar eventos em destaque.",
    };
  }
}

export async function getUpcomingEvents(limit = 5) {
  try {
    const now = new Date();

    const events = await db
      .select()
      .from(event)
      .where(and(eq(event.status, "published"), gte(event.startDate, now)))
      .orderBy(asc(event.startDate))
      .limit(limit);

    return {
      success: true,
      events,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar próximos eventos:", error);
    return {
      success: false,
      events: [],
      error: "Falha ao buscar próximos eventos.",
    };
  }
}

export async function getPastEvents(limit = 5) {
  try {
    const now = new Date();

    const events = await db
      .select()
      .from(event)
      .where(and(eq(event.status, "completed"), lte(event.endDate, now)))
      .orderBy(desc(event.endDate))
      .limit(limit);

    return {
      success: true,
      events,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos passados:", error);
    return {
      success: false,
      events: [],
      error: "Falha ao buscar eventos passados.",
    };
  }
}

// ==========================================
// MUTATIONS
// ==========================================

export async function createEvent(data: NewEvent) {
  try {
    const user = await getCurrentUser();
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        event: null,
        error: "Você não tem autorização para criar eventos.",
      };
    }

    const newEvent = await db
      .insert(event)
      .values({
        ...data,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      event: newEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return {
      success: false,
      event: null,
      error: "Falha ao criar evento.",
    };
  }
}

export async function updateEvent(eventId: string, data: Partial<NewEvent>) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        event: null,
        error: "Você não tem autorização para atualizar eventos.",
      };
    }

    const updatedEvent = await db
      .update(event)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(event.id, eventId))
      .returning();

    if (updatedEvent.length === 0) {
      return {
        success: false,
        event: null,
        error: "Evento não encontrado.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return {
      success: false,
      event: null,
      error: "Falha ao atualizar evento.",
    };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "Você não tem autorização para deletar eventos.",
      };
    }

    const registrations = await db
      .select()
      .from(registration)
      .where(eq(registration.eventId, eventId));

    if (registrations.length > 0) {
      return {
        success: false,
        error: "Não é possível deletar evento com inscrições existentes.",
      };
    }

    await db.delete(event).where(eq(event.id, eventId));

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return {
      success: false,
      error: "Falha ao deletar evento.",
    };
  }
}

export async function publishEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "Você não tem autorização para publicar eventos.",
      };
    }

    const updatedEvent = await db
      .update(event)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(eq(event.id, eventId))
      .returning();

    if (updatedEvent.length === 0) {
      return {
        success: false,
        error: "Evento não encontrado.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Erro ao publicar evento:", error);
    return {
      success: false,
      error: "Falha ao publicar evento.",
    };
  }
}

export async function cancelEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "Você não tem autorização para cancelar eventos.",
      };
    }

    const updatedEvent = await db
      .update(event)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(event.id, eventId))
      .returning();

    if (updatedEvent.length === 0) {
      return {
        success: false,
        error: "Evento não encontrado.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Erro ao cancelar evento:", error);
    return {
      success: false,
      error: "Falha ao cancelar evento.",
    };
  }
}

// ==========================================
// ESTATÍSTICAS
// ==========================================

export async function getEventStats(eventId: string) {
  try {
    const eventData = await db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!eventData) {
      return {
        success: false,
        stats: null,
        error: "Evento não encontrado.",
      };
    }

    const totalRegistrations = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration)
      .where(eq(registration.eventId, eventId));

    const totalAttended = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration)
      .where(
        and(
          eq(registration.eventId, eventId),
          eq(registration.status, "attended")
        )
      );

    const waitlistCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlist)
      .where(eq(waitlist.eventId, eventId));

    const stats = {
      totalCapacity: eventData.maxAttendees,
      currentRegistrations: totalRegistrations[0].count,
      attended: totalAttended[0].count,
      waitlist: waitlistCount[0].count,
      availableSpots: eventData.maxAttendees - totalRegistrations[0].count,
      occupancyRate:
        (totalRegistrations[0].count / eventData.maxAttendees) * 100,
    };

    return {
      success: true,
      stats,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do evento:", error);
    return {
      success: false,
      stats: null,
      error: "Falha ao buscar estatísticas.",
    };
  }
}

export async function getDashboardStats() {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        stats: null,
        error:
          "Você não tem autorização para visualizar estatísticas do painel.",
      };
    }

    const totalEvents = await db
      .select({ count: sql<number>`count(*)` })
      .from(event);

    const publishedEvents = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.status, "published"));

    const totalRegistrations = await db
      .select({ count: sql<number>`count(*)` })
      .from(registration);

    const now = new Date();
    const upcomingEvents = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(and(eq(event.status, "published"), gte(event.startDate, now)));

    const stats = {
      totalEvents: totalEvents[0].count,
      publishedEvents: publishedEvents[0].count,
      upcomingEvents: upcomingEvents[0].count,
      totalRegistrations: totalRegistrations[0].count,
    };

    return {
      success: true,
      stats,
      error: null,
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do painel:", error);
    return {
      success: false,
      stats: null,
      error: "Falha ao buscar estatísticas do painel.",
    };
  }
}
