"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/db/schema";
import { formatEventDate, formatEventTime } from "@/lib/utils/date";
import {
  calculateAvailableSpots,
  getEventCategoryLabel,
  isEventFull,
} from "@/lib/utils/event";
import { Calendar, Edit, MapPin, Trash2, Users } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  isAdmin,
  onEdit,
  onDelete,
}: EventCardProps) {
  const availableSpots = calculateAvailableSpots(
    event.maxAttendees,
    event.currentAttendees
  );
  const isFull = isEventFull(event.maxAttendees, event.currentAttendees);

  return (
    <Card className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {event.bannerUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={event.bannerUrl}
          />
          <div className="absolute top-3 right-3">
            <Badge variant={isFull ? "destructive" : "default"}>
              {getEventCategoryLabel(event.category)}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>
            {formatEventDate(event.startDate)} às{" "}
            {formatEventTime(event.startDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span
            className={
              isFull ? "font-medium text-destructive" : "text-muted-foreground"
            }
          >
            {isFull
              ? "Esgotado"
              : `${availableSpots} vaga${availableSpots !== 1 ? "s" : ""} disponível${availableSpots !== 1 ? "eis" : ""}`}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {isAdmin ? (
          <>
            <Button
              className="flex-1"
              onClick={() => onEdit?.(event.id)}
              size="sm"
              variant="outline"
            >
              <Edit className="mr-1 h-4 w-4" />
              Editar
            </Button>
            <Button
              onClick={() => onDelete?.(event.id)}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/eventos/${event.id}`}>
              {isFull ? "Lista de Espera" : "Ver Detalhes"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
