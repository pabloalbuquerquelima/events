import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEvents, getPastEvents, getUpcomingEvents } from "@/server/events";
import { EventList } from "../../components/event-list";

export default async function EventosPage() {
  const [allEvents, upcomingEvents, pastEvents] = await Promise.all([
    getEvents({ status: "published", limit: 12 }),
    getUpcomingEvents(6),
    getPastEvents(6),
  ]);

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
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
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="past">Passados</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <EventList
              emptyMessage="Nenhum evento disponível no momento."
              events={allEvents.events}
            />
          </TabsContent>

          <TabsContent value="upcoming">
            <EventList
              emptyMessage="Nenhum evento próximo disponível."
              events={upcomingEvents.events}
            />
          </TabsContent>

          <TabsContent value="past">
            <EventList
              emptyMessage="Nenhum evento passado encontrado."
              events={pastEvents.events}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
