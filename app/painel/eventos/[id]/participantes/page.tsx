"use client";

import {
  ArrowLeft,
  Calendar,
  Download,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdmin } from "@/hooks/use-admin";
import { type Event, useEvents } from "@/hooks/use-events";
import { getRegistrationStatusLabel } from "@/lib/utils/event";

interface RegistrationWithParticipant {
  id: string;
  eventId: string;
  userId: string;
  attendeesCount: number;
  status: string;
  qrCode: string;
  checkedInAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  participantInfo?: {
    id: string;
    name: string;
    cpf: string;
    municipality: string;
    state: string;
    contact: string;
    email: string;
  };
}

export default function ParticipantesEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, isLoading: isCheckingAdmin } = useAdmin();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<
    RegistrationWithParticipant[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getEventById } = useEvents();

  const eventId = params?.id as string;

  useEffect(() => {
    // Se terminou de verificar admin e NÃO é admin, redireciona
    if (!(isCheckingAdmin || isAdmin)) {
      toast.error("Você não tem permissão para acessar esta página");
      router.push("/eventos");
      return;
    }

    // Se é admin, carrega os dados
    if (isAdmin && eventId) {
      loadEventData();
    }
  }, [isAdmin, isCheckingAdmin, eventId]);

  const loadEventData = async () => {
    setIsLoading(true);
    try {
      // Carregar evento
      const eventResult = await getEventById(eventId);
      if (eventResult.success && eventResult.event) {
        setEvent(eventResult.event);
      }

      // Carregar inscrições com dados dos participantes
      const response = await fetch(`/api/events/${eventId}/participants`);

      if (!response.ok) {
        console.error("Erro na API:", response.status);
        throw new Error("Erro ao carregar participantes");
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error loading event data:", error);
      toast.error("Erro ao carregar dados do evento");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      toast.error("Não há participantes para exportar");
      return;
    }

    const headers = [
      "Nome",
      "CPF",
      "Município",
      "Estado",
      "Contato",
      "Email",
      "Status",
      "Data Inscrição",
      "Check-in",
    ];

    const rows = registrations.map((reg) => [
      reg.participantInfo?.name || reg.user.name,
      reg.participantInfo?.cpf || "",
      reg.participantInfo?.municipality || "",
      reg.participantInfo?.state || "",
      reg.participantInfo?.contact || "",
      reg.participantInfo?.email || reg.user.email,
      getRegistrationStatusLabel(reg.status),
      new Date(reg.createdAt).toLocaleDateString("pt-BR"),
      reg.checkedInAt
        ? new Date(reg.checkedInAt).toLocaleString("pt-BR")
        : "Não realizado",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `participantes-${event?.title || "evento"}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("CSV exportado com sucesso!");
  };

  // Loading state
  if (isCheckingAdmin || isLoading) {
    return (
      <div className="min-h-screen px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="mb-8 h-12 w-64" />
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton className="h-24 w-full" key={i} />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild size="icon" variant="ghost">
              <Link href="/painel/eventos">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-3xl">Participantes do Evento</h1>
              {event && (
                <p className="mt-1 text-muted-foreground">{event.title}</p>
              )}
            </div>
          </div>
          <Button
            disabled={registrations.length === 0}
            onClick={exportToCSV}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">
                Total de Inscritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{registrations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {registrations.filter((r) => r.status === "confirmed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">
                Check-in Realizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {registrations.filter((r) => r.status === "attended").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-medium text-sm">Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {registrations.filter((r) => r.status === "cancelled").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Participantes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Participantes</CardTitle>
            <CardDescription>
              Informações detalhadas de todos os inscritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="py-12 text-center">
                <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum participante inscrito ainda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Município/Estado</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Inscrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {reg.participantInfo?.name || reg.user.name}
                          </div>
                        </TableCell>
                        <TableCell>{reg.participantInfo?.cpf || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {reg.participantInfo
                              ? `${reg.participantInfo.municipality}/${reg.participantInfo.state}`
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {reg.participantInfo?.contact || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="max-w-[200px] truncate">
                              {reg.participantInfo?.email || reg.user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getRegistrationStatusLabel(reg.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4" />
                            {new Date(reg.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
