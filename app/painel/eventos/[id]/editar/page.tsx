import { EditEventForm } from "@/components/forms/edit-event-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getEventById } from "@/server/events";
import { headers } from "next/headers";
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

export default async function EditarEventoPage({
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
  const { event } = await getEventById(id);

  if (!event) {
    notFound();
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
