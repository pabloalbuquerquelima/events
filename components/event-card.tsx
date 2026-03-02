"use client";

import { Calendar, Edit, MapPin, Trash2, Users } from "lucide-react";
import Link from "next/link";
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

interface EventCardProps {
  event: Event & { allowWaitlist?: boolean; endDate?: string | null };
  isAdmin?: boolean;
  onEdit?: (eventId: string) => void;
  onViewParticipants?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export function EventCard({
  event,
  isAdmin,
  onEdit,
  onViewParticipants,
  onDelete,
}: EventCardProps) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : start;
  const isPast = end < now;

  const availableSpots = calculateAvailableSpots(
    event.maxAttendees,
    event.currentAttendees
  );
  const isFull = isEventFull(event.maxAttendees, event.currentAttendees);

  const allowWaitlist = !!(event as any).allowWaitlist;

  const isWaitlist = isFull && allowWaitlist;

  const cardStateClass = [
    "group overflow-hidden transition-shadow duration-300",
    "hover:shadow-lg",
    isPast ? "filter grayscale opacity-70" : "",
    isWaitlist ? "border-2 border-dashed border-slate-300 bg-white/30" : "",
  ].join(" ");

  const statusBadge = () => {
    if (isPast)
      return (
        <span className="rounded-full bg-gray-200 px-2 py-0.5 font-semibold text-gray-800 text-xs">
          Passado
        </span>
      );
    if (isWaitlist)
      return (
        <span className="rounded-full border border-slate-300 bg-transparent px-2 py-0.5 font-semibold text-xs">
          Lista de Espera
        </span>
      );
    if (isFull)
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700 text-xs">
          Esgotado
        </span>
      );
    return null;
  };

  const UserPrimaryAction = () => {
    if (isPast) {
      return (
        <Button
          aria-disabled
          className="w-full cursor-not-allowed opacity-60"
          disabled
          size="sm"
        >
          Inscrições Encerradas
        </Button>
      );
    }

    if (isWaitlist) {
      return (
        <Button
          className="w-full border-dashed bg-transparent hover:bg-white/5"
          onClick={() => {
            /* acione a lógica de entrar na lista de espera aqui */
          }}
          size="sm"
        >
          Entrar na Lista de Espera
        </Button>
      );
    }

    if (isFull && !allowWaitlist) {
      return (
        <Button
          className="w-full cursor-not-allowed opacity-80"
          disabled
          size="sm"
          variant="outline"
        >
          Esgotado
        </Button>
      );
    }

    return (
      <Button asChild className="w-full" size="sm">
        <Link href={`/eventos/${event.id}`}>Ver Detalhes</Link>
      </Button>
    );
  };

  return (
    <Card className={cardStateClass}>
      {event.bannerUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            alt={event.title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? "grayscale" : ""}`}
            src={event.bannerUrl}
          />
          <div className="absolute top-3 left-3">{statusBadge()}</div>
          <div className="absolute top-3 right-3">
            <Badge variant={isFull ? "destructive" : "default"}>
              {getEventCategoryLabel(event.category)}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground text-sm">
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

        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span
              className={
                isFull
                  ? "font-medium text-destructive"
                  : "text-muted-foreground"
              }
            >
              {isFull
                ? "Esgotado"
                : `${availableSpots} vaga${availableSpots !== 1 ? "s" : ""} disponível${availableSpots !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* dica sutil para lista de espera */}
          {isWaitlist && (
            <span className="text-slate-500 text-xs italic">
              Você pode entrar na lista de espera
            </span>
          )}
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
              className="flex-1"
              onClick={() => onViewParticipants?.(event.id)}
              size="sm"
              variant="outline"
            >
              <Users className="mr-1 h-4 w-4" />
              Ver Participantes
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
          <>
            <div className="flex-1">
              <UserPrimaryAction />
            </div>

            {/* ... dentro do CardFooter, substitua a coluna de "Detalhes" por isto */}
            <div className="w-36">
              <Button asChild className="" size="sm" variant="ghost">
                <Link
                  className="text-blue-600 hover:underline focus:outline-none"
                  href={`/eventos/${event.id}`}
                >
                  Detalhes
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
