import { RegistrationButton } from "@/components/events/registration-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getEventById } from "@/server/events";
import { checkUserRegistration } from "@/server/registrations";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { event } = await getEventById(id);

  if (!event) {
    notFound();
  }

  const { isRegistered, isOnWaitlist } = await checkUserRegistration(id);

  const isPast = isEventPast(event.endDate);
  const isFull = isEventFull(event.maxAttendees, event.currentAttendees);
  const availableSpots = calculateAvailableSpots(
    event.maxAttendees,
    event.currentAttendees
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Banner */}
      {event.bannerUrl && (
        <div className="relative h-96 w-full">
          <img
            alt={event.title}
            className="h-full w-full object-cover"
            src={event.bannerUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          <Button
            asChild
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
            size="icon"
            variant="ghost"
          >
            <Link href="/eventos">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
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
            {!isPast && event.status === "published" && (
              <Card>
                <CardContent className="pt-6">
                  <RegistrationButton
                    eventId={event.id}
                    isFull={isFull}
                    isOnWaitlist={isOnWaitlist}
                    isRegistered={isRegistered}
                  />
                  <p className="mt-2 text-center text-muted-foreground text-xs">
                    {isRegistered
                      ? "Você receberá um QR code para entrada"
                      : isOnWaitlist
                        ? "Você será notificado caso uma vaga abra"
                        : "Inscrições gratuitas enquanto houver vagas"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Evento</CardTitle>
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
                        : `${availableSpots} de ${event.maxAttendees} vagas disponíveis`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
