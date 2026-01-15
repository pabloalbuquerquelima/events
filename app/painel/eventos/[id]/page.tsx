import { EventStats } from "@/components/events/event-stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { formatEventDateTime, isEventPast } from "@/lib/utils/date";
import {
  getEventCategoryLabel,
  getEventStatusLabel,
  getRegistrationStatusLabel,
} from "@/lib/utils/event";
import { getEventById, getEventStats } from "@/server/events";
import { getEventRegistrations } from "@/server/registrations";
import { ArrowLeft, Calendar, Edit, MapPin, Trash2, Users } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function isAdmin() {
  try {
    const { success } = await auth.api.hasPermission({
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

export default async function GerenciarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const admin = await isAdmin();

  if (!admin) {
    redirect("/eventos");
  }

  const { id } = await params;
  const [eventResult, statsResult, registrationsResult] = await Promise.all([
    getEventById(id),
    getEventStats(id),
    getEventRegistrations(id),
  ]);

  if (!eventResult.event) {
    notFound();
  }

  const { event } = eventResult;
  const { stats } = statsResult;
  const { registrations } = registrationsResult;

  const isPast = isEventPast(event.endDate);

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild size="icon" variant="ghost">
              <Link href="/painel/eventos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-3xl">{event.title}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge>{getEventCategoryLabel(event.category)}</Badge>
                <Badge variant="outline">
                  {getEventStatusLabel(event.status)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/painel/eventos/${event.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Deletar
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <EventStats stats={stats} />
          </div>
        )}

        {/* Info */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Data e Horário</p>
                  <p className="text-muted-foreground text-sm">
                    {formatEventDateTime(event.startDate)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    até {formatEventDateTime(event.endDate)}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Inscritos ({registrations.length})</CardTitle>
            <CardDescription>
              Lista de todos os participantes inscritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                Nenhum inscrito ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {registrations.map((reg) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-4"
                    key={reg.id}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{reg.user.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {reg.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getRegistrationStatusLabel(reg.status)}
                      </Badge>
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        {reg.attendeesCount}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
