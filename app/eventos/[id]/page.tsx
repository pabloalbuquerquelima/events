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
      <div className="min-h-screen w-full overflow-x-hidden pt-24 pb-16">
        <div className="container mx-auto w-full max-w-6xl px-4">
          <Skeleton className="mb-8 h-64 w-full md:h-96" />
          <div className="grid w-full gap-8 lg:grid-cols-3">
            <div className="w-full space-y-4 lg:col-span-2">
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
    <div className="min-h-screen w-full overflow-x-hidden pb-16">
      {/* Hero Section com Banner */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient Background */}
        <div className="h-48 w-full bg-gradient-to-r from-primary to-blue-500 sm:h-56 md:h-64 lg:h-80" />

        {/* Botão Voltar */}
        <div className="container absolute top-0 right-0 left-0 z-30 mx-auto w-full max-w-6xl px-4">
          <Button
            className="mt-4 bg-background/80 backdrop-blur-sm"
            onClick={() => router.push("/eventos")}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Banner do Evento */}
        <div className="container absolute top-0 right-0 left-0 z-20 mx-auto w-full max-w-4xl px-4 pt-16 sm:pt-20 md:pt-24">
          {event.bannerUrl ? (
            <img
              alt={event.title}
              className="aspect-video w-full max-w-full rounded-lg object-cover shadow-2xl ring-1 ring-white/10 sm:rounded-xl md:rounded-2xl lg:aspect-[21/9]"
              loading="lazy"
              src={event.bannerUrl ?? undefined}
            />
          ) : (
            <div className="flex aspect-video w-full max-w-full items-center justify-center rounded-lg bg-gray-100 sm:rounded-xl md:rounded-2xl lg:aspect-[21/9]">
              <span className="text-muted-foreground text-sm">Sem imagem</span>
            </div>
          )}
        </div>
      </div>

      {/* Espaçador para compensar o banner absoluto */}
      <div className="h-64 sm:h-72 md:h-80 lg:h-96" />

      {/* Content */}
      <div className="container mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
        <div className="grid w-full gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="w-full min-w-0 space-y-4 lg:col-span-2 lg:space-y-6">
            <div className="w-full">
              <Badge className="mb-3 md:mb-4">
                {getEventCategoryLabel(event.category)}
              </Badge>
              <h1 className="mb-3 w-full break-words font-bold text-2xl md:mb-4 md:text-4xl lg:text-5xl">
                {event.title}
              </h1>
              <p className="w-full break-words text-base text-muted-foreground md:text-lg lg:text-xl">
                {event.description}
              </p>
            </div>

            {/* Registration Section */}
            {!isPast && (
              <Card className="w-full">
                <CardContent className="w-full p-4 md:p-6">
                  <RegistrationButton eventId={event.id} isFull={isFull} />
                  <p className="mt-2 w-full text-center text-muted-foreground text-xs">
                    Inscrições gratuitas • Vagas limitadas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full min-w-0 space-y-4 lg:space-y-6">
            {/* Informações do Evento */}
            <Card className="w-full">
              <CardHeader className="w-full">
                <CardTitle className="text-base md:text-lg">
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full space-y-4">
                <div className="flex w-full items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-medium text-sm">Data</p>
                    <p className="truncate text-muted-foreground text-sm">
                      {formatEventDate(event.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-medium text-sm">Horário</p>
                    <p className="text-muted-foreground text-sm">
                      {formatEventTime(event.startDate)} -{" "}
                      {formatEventTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="font-medium text-sm">Local</p>
                    <p className="break-words text-muted-foreground text-sm">
                      {event.location}
                    </p>
                    {event.address && (
                      <p className="mt-1 break-words text-muted-foreground text-xs">
                        {event.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="min-w-0 flex-1 overflow-hidden">
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
            <div className="w-full">
              <EventQRCode eventId={event.id} eventTitle={event.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
