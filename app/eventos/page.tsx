"use client";

import { useEffect, useState } from "react";
import { EventList } from "@/components/event-list";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Event, useEvents } from "@/hooks/use-events";

export default function EventosPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const { isLoading, getEvents } = useEvents();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    // Carregar todos os eventos publicados
    const allResult = await getEvents();
    if (allResult.success) {
      setAllEvents(allResult.events);
    }

    // Carregar eventos próximos
    const upcomingResult = await getEvents({
      status: "published",
      upcoming: true,
    });
    if (upcomingResult.success) {
      setUpcomingEvents(upcomingResult.events);
    }

    // Carregar eventos passados
    const pastResult = await getEvents({
      status: "completed",
      past: true,
    });
    if (pastResult.success) {
      setPastEvents(pastResult.events);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center">
          <Badge className="mb-4" variant="outline">
            Eventos SEDUC Coreaú
          </Badge>
          <h1 className="font-bold text-4xl">
            Eventos e{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Formações
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Participe de workshops, palestras e conferências com especialistas
            em educação.
          </p>
        </div>

        {/* Tabs */}
        <Tabs className="space-y-8" defaultValue="all">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              Todos {!isLoading && `(${allEvents.length})`}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Próximos {!isLoading && `(${upcomingEvents.length})`}
            </TabsTrigger>
            <TabsTrigger value="past">
              Passados {!isLoading && `(${pastEvents.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton className="h-96 w-full rounded-lg" key={i} />
                ))}
              </div>
            ) : (
              <EventList
                emptyMessage="Nenhum evento disponível no momento."
                events={allEvents}
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton className="h-96 w-full rounded-lg" key={i} />
                ))}
              </div>
            ) : (
              <EventList
                emptyMessage="Nenhum evento próximo disponível."
                events={upcomingEvents}
              />
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton className="h-96 w-full rounded-lg" key={i} />
                ))}
              </div>
            ) : (
              <EventList
                emptyMessage="Nenhum evento passado encontrado."
                events={pastEvents}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
