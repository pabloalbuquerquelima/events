"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EventList } from "@/components/event-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/hooks/use-admin";
import { type Event, useEvents } from "@/hooks/use-events";

export default function EventosAdminPage() {
  const router = useRouter();
  const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [draftEvents, setDraftEvents] = useState<Event[]>([]);
  const { isLoading, getEvents, deleteEvent } = useEvents();

  useEffect(() => {
    if (!(isCheckingAdmin || isAdmin)) {
      router.push("/eventos");
    }
  }, [isAdmin, isCheckingAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadEvents();
    }
  }, [isAdmin]);

  async function loadEvents() {
    const [all, published, drafts] = await Promise.all([
      getEvents(),
      getEvents({ status: "published" }),
      getEvents({ status: "draft" }),
    ]);

    if (all.success) setAllEvents(all.events);
    if (published.success) setPublishedEvents(published.events);
    if (drafts.success) setDraftEvents(drafts.events);
  }

  const handleEdit = (eventId: string) => {
    router.push(`/painel/eventos/${eventId}/editar`);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Tem certeza que deseja deletar este evento?")) return;

    const result = await deleteEvent(eventId);
    if (result.success) {
      loadEvents();
    }
  };

  const handleViewParticipants = (eventId: string) => {
    router.push(`/painel/eventos/${eventId}/participantes`);
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="mb-8 h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Gerenciar Eventos</h1>
            <p className="mt-1 text-muted-foreground">
              Criar e gerenciar eventos educacionais
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/painel/eventos/criar">
              <Plus className="mr-2 h-5 w-5" />
              Criar Evento
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs className="space-y-8" defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({allEvents.length})</TabsTrigger>
            <TabsTrigger value="published">
              Publicados ({publishedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rascunhos ({draftEvents.length})
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
                emptyMessage="Nenhum evento criado ainda."
                events={allEvents}
                isAdmin
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewParticipants={handleViewParticipants}
              />
            )}
          </TabsContent>

          <TabsContent value="published">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton className="h-96 w-full rounded-lg" key={i} />
                ))}
              </div>
            ) : (
              <EventList
                emptyMessage="Nenhum evento publicado."
                events={publishedEvents}
                isAdmin
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewParticipants={handleViewParticipants}
              />
            )}
          </TabsContent>

          <TabsContent value="drafts">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton className="h-96 w-full rounded-lg" key={i} />
                ))}
              </div>
            ) : (
              <EventList
                emptyMessage="Nenhum rascunho."
                events={draftEvents}
                isAdmin
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewParticipants={handleViewParticipants}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
