"use client";

import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventQRCode } from "@/components/event-qr-code";
import { RegistrationButton } from "@/components/registration-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Event, useEvents } from "@/hooks/use-events";
import {
  formatEventDate,
  formatEventTime,
  isEventPast,
} from "@/lib/utils/date";
import {
  calculateAvailableSpots,
  getEventCategoryLabel,
  isEventFull,
} from "@/lib/utils/event";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const { isLoading, getEventById } = useEvents();

  const eventId = params?.id as string;

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return;

      const result = await getEventById(eventId);
      if (result.success && result.event) {
        setEvent(result.event);
      } else {
        router.push("/eventos");
      }
    }

    loadEvent();
  }, [eventId]);

  if (isLoading || !event) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <Skeleton className="mb-8 h-96 w-full" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isPast = isEventPast(event.endDate);
  const isFull = isEventFull(event.maxAttendees, event.currentAttendees);
  const availableSpots = calculateAvailableSpots(
    event.maxAttendees,
    event.currentAttendees
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Banner */}
      <div className="relative h-96 w-full overflow-visible">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-blue-500" />

        <Button
          className="absolute top-4 left-4 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => router.push("/eventos")}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Banner do evento — fica por cima da hero */}
        <div className="absolute -bottom-24 left-1/2 z-20 w-full max-w-4xl -translate-x-1/2 transform px-4 md:-bottom-32">
          {event.bannerUrl ? (
            <img
              alt={event.title}
              className="h-96 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 md:h-[550px]"
              loading="lazy"
              src={event.bannerUrl ?? undefined}
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-2xl bg-gray-100 md:h-[550px]">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
        </div>
      </div>

      {/* Content: aumente o padding-top para abrir espaço para o banner sobreposto */}
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-40">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <Badge className="mb-4">
                {getEventCategoryLabel(event.category)}
              </Badge>
              <h1 className="mb-4 font-bold text-3xl md:text-5xl">
                {event.title}
              </h1>
              <p className="text-muted-foreground text-xl">
                {event.description}
              </p>
            </div>

            {/* Registration Section */}
            {!isPast && (
              <Card>
                <CardContent className="pt-6">
                  <RegistrationButton eventId={event.id} isFull={isFull} />
                  <p className="mt-2 text-center text-muted-foreground text-xs">
                    Inscrições gratuitas • Vagas limitadas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Evento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Data</p>
                    <p className="text-muted-foreground text-sm">
                      {formatEventDate(event.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Horário</p>
                    <p className="text-muted-foreground text-sm">
                      {formatEventTime(event.startDate)} -{" "}
                      {formatEventTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Local</p>
                    <p className="text-muted-foreground text-sm">
                      {event.location}
                    </p>
                    {event.address && (
                      <p className="mt-1 text-muted-foreground text-xs">
                        {event.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Vagas</p>
                    <p
                      className={`text-sm ${
                        isFull
                          ? "font-medium text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isFull
                        ? "Esgotado"
                        : `${availableSpots} de ${event.maxAttendees} disponíveis`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code do Evento */}
            <EventQRCode eventId={event.id} eventTitle={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
