"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Clock, Users } from "lucide-react";

interface EventStatsProps {
  stats: {
    totalCapacity: number;
    currentRegistrations: number;
    attended: number;
    waitlist: number;
    availableSpots: number;
    occupancyRate: number;
  };
}

export function EventStats({ stats }: EventStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Inscrições Confirmadas
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats.currentRegistrations}/{stats.totalCapacity}
          </div>
          <p className="text-muted-foreground text-xs">
            Taxa de ocupação: {stats.occupancyRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Comparecimentos</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.attended}</div>
          <p className="text-muted-foreground text-xs">Check-ins realizados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Vagas Disponíveis
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.availableSpots}</div>
          <p className="text-muted-foreground text-xs">Vagas restantes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Lista de Espera</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.waitlist}</div>
          <p className="text-muted-foreground text-xs">Pessoas aguardando</p>
        </CardContent>
      </Card>
    </div>
  );
}
