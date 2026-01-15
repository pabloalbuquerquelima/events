import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { getDashboardStats, getEvents } from "@/server/events";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EventStats } from "../../../components/event-stats";
import { EventList } from "../../../components/events/event-list";

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

export default async function EventosAdminPage() {
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

  const [allEvents, publishedEvents, draftEvents, stats] = await Promise.all([
    getEvents(),
    getEvents({ status: "published" }),
    getEvents({ status: "draft" }),
    getDashboardStats(),
  ]);

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

        {/* Stats (se disponíveis) */}
        {stats && (
          <div className="mb-8">
            <EventStats stats={stats} />
          </div>
        )}

        {/* Tabs */}
        <Tabs className="space-y-8" defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              Todos ({allEvents.events.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicados ({publishedEvents.events.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rascunhos ({draftEvents.events.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <EventList
              emptyMessage="Nenhum evento criado ainda."
              events={allEvents.events}
              isAdmin
            />
          </TabsContent>

          <TabsContent value="published">
            <EventList
              emptyMessage="Nenhum evento publicado."
              events={publishedEvents.events}
              isAdmin
            />
          </TabsContent>

          <TabsContent value="drafts">
            <EventList
              emptyMessage="Nenhum rascunho."
              events={draftEvents.events}
              isAdmin
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
