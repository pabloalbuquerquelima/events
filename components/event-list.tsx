"use client";

import type { Event } from "@/db/schema";
import { EventCard } from "./event-card";

interface EventListProps {
  events: Event[];
  isAdmin?: boolean;
  emptyMessage?: string;
  onEdit?: (eventId: string) => void;
  onViewParticipants?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export function EventList({
  events,
  isAdmin,
  emptyMessage = "Nenhum evento encontrado.",
  onEdit,
  onViewParticipants,
  onDelete,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          event={event}
          isAdmin={isAdmin}
          key={event.id}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewParticipants={onViewParticipants}
        />
      ))}
    </div>
  );
}
