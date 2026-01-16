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
    console.error("Error fetching events:", error);
    return {
      success: false,
      events: [],
      error: "Failed to fetch events.",
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
        error: "Event not found.",
      };
    }

    return {
      success: true,
      event: eventData,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      event: null,
      error: "Failed to fetch event.",
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
    console.error("Error fetching featured events:", error);
    return {
      success: false,
      events: [],
      error: "Failed to fetch featured events.",
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
    console.error("Error fetching upcoming events:", error);
    return {
      success: false,
      events: [],
      error: "Failed to fetch upcoming events.",
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
    console.error("Error fetching past events:", error);
    return {
      success: false,
      events: [],
      error: "Failed to fetch past events.",
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
        error: "You are not authorized to create events.",
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
    console.error("Error creating event:", error);
    return {
      success: false,
      event: null,
      error: "Failed to create event.",
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
        error: "You are not authorized to update events.",
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
        error: "Event not found.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      event: null,
      error: "Failed to update event.",
    };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "You are not authorized to delete events.",
      };
    }

    const registrations = await db
      .select()
      .from(registration)
      .where(eq(registration.eventId, eventId));

    if (registrations.length > 0) {
      return {
        success: false,
        error: "Cannot delete event with existing registrations.",
      };
    }

    await db.delete(event).where(eq(event.id, eventId));

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: "Failed to delete event.",
    };
  }
}

export async function publishEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "You are not authorized to publish events.",
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
        error: "Event not found.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Error publishing event:", error);
    return {
      success: false,
      error: "Failed to publish event.",
    };
  }
}

export async function cancelEvent(eventId: string) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return {
        success: false,
        error: "You are not authorized to cancel events.",
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
        error: "Event not found.",
      };
    }

    return {
      success: true,
      event: updatedEvent[0],
      error: null,
    };
  } catch (error) {
    console.error("Error cancelling event:", error);
    return {
      success: false,
      error: "Failed to cancel event.",
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
        error: "Event not found.",
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
    console.error("Error fetching event stats:", error);
    return {
      success: false,
      stats: null,
      error: "Failed to fetch event stats.",
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
        error: "You are not authorized to view dashboard stats.",
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
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      stats: null,
      error: "Failed to fetch dashboard stats.",
    };
  }
}
