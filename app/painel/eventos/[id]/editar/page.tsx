"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditEventForm } from "@/components/forms/edit-event-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/hooks/use-admin";
import { type Event, useEvents } from "@/hooks/use-events";

export default function EditarEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
  const [event, setEvent] = useState<Event | null>(null);
  const { isLoading, getEventById } = useEvents();

  const eventId = params?.id as string;

  useEffect(() => {
    if (!(isCheckingAdmin || isAdmin)) {
      router.push("/eventos");
    }
  }, [isAdmin, isCheckingAdmin, router]);

  useEffect(() => {
    if (isAdmin && eventId) {
      loadEvent();
    }
  }, [isAdmin, eventId]);

  async function loadEvent() {
    const result = await getEventById(eventId);
    if (result.success && result.event) {
      setEvent(result.event);
    } else {
      router.push("/painel/eventos");
    }
  }

  if (isCheckingAdmin || isLoading || !event) {
    return (
      <div className="min-h-screen px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-3xl">
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
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar Evento</CardTitle>
            <CardDescription>Atualize as informações do evento</CardDescription>
          </CardHeader>
          <CardContent>
            <EditEventForm event={event} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
