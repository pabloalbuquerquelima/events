"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Registration, useRegistrations } from "@/hooks/use-registrations";
import { authClient } from "@/lib/auth-client";
import { formatEventDateTime } from "@/lib/utils/date";
import { getRegistrationStatusLabel } from "@/lib/utils/event";

export default function MinhasInscricoesPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { isLoading, getMyRegistrations } = useRegistrations();

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="mb-8 h-12 w-64" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton className="h-96 w-full rounded-lg" key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="min-h-screen px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-8 font-bold text-3xl">Minhas Inscrições</h1>

          <Card>
            <CardHeader>
              <CardTitle>Nenhuma inscrição</CardTitle>
              <CardDescription>
                Você ainda não está inscrito em nenhum evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/eventos">Ver Eventos Disponíveis</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 font-bold text-3xl">Minhas Inscrições</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {registrations.map((reg) => {
            if (!reg.event) return null;

            return (
              <Card className="overflow-hidden" key={reg.id}>
                {reg.event.bannerUrl && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      alt={reg.event.title}
                      className="h-full w-full object-cover"
                      src={reg.event.bannerUrl}
                    />
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {reg.event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {reg.event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatEventDateTime(reg.event.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{reg.event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{reg.attendeesCount} pessoa(s)</span>
                    </div>
                  </div>

                  {reg.qrCode && (
                    <div className="border-t pt-4">
                      <QRCodeDisplay
                        eventTitle={reg.event.title}
                        qrCode={reg.qrCode}
                      />
                    </div>
                  )}

                  <Badge className="w-full justify-center">
                    {getRegistrationStatusLabel(reg.status)}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
