"use client";

import { ParticipantInfoDialog } from "@/components/participant-info-dialog";
import { Button } from "@/components/ui/button";
import { useRegistrations } from "@/hooks/use-registrations";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RegistrationButtonProps {
  eventId: string;
  isFull: boolean;
  disabled?: boolean;
}

export function RegistrationButton({
  eventId,
  isFull,
  disabled,
}: RegistrationButtonProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [showParticipantDialog, setShowParticipantDialog] = useState(false);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { isLoading, checkRegistration, registerForEvent } = useRegistrations();

  useEffect(() => {
    async function checkStatus() {
      if (!session?.user) {
        setIsChecking(false);
        return;
      }

      const result = await checkRegistration(eventId);
      setIsRegistered(result.isRegistered);
      setIsOnWaitlist(result.isOnWaitlist);
      setIsChecking(false);
    }

    checkStatus();
  }, [eventId, session]);

  const handleRegisterClick = () => {
    if (!session?.user) {
      router.push(`/login?redirect=/eventos/${eventId}`);
      return;
    }

    setShowParticipantDialog(true);
  };

  // Retorna true em caso de sucesso, false em caso de erro
  const handleParticipantInfoSubmit = async (participantData: {
    name: string;
    cpf: string;
    municipality: string;
    state: string;
    contact: string;
    email: string;
  }): Promise<boolean> => {
    try {
      const result = await registerForEvent(eventId, 1, participantData);

      if (result.success) {
        setShowParticipantDialog(false);

        if (result.registration) {
          toast.success("Inscrição realizada com sucesso!");
          router.push("/painel/minhas-inscricoes");
        } else if (result.waitlist) {
          toast.success("Você foi adicionado à lista de espera!");
          setIsOnWaitlist(true);
          router.refresh();
        }

        return true;
      }
      toast.error(
        result.message ?? "Erro ao realizar inscrição. Tente novamente."
      );
      return false;
    } catch (error) {
      console.error("Erro ao realizar inscrição:", error);
      toast.error("Erro inesperado. Tente novamente.");
      return false;
    }
  };

  if (isChecking) {
    return (
      <Button className="w-full" disabled size="lg">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Verificando...
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button className="w-full" onClick={handleRegisterClick} size="lg">
        Fazer Login para Inscrever-se
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <Button className="w-full" disabled size="lg" variant="secondary">
        Você já está inscrito ✓
      </Button>
    );
  }

  if (isOnWaitlist) {
    return (
      <Button className="w-full" disabled size="lg" variant="outline">
        Você está na lista de espera
      </Button>
    );
  }

  return (
    <>
      <Button
        className="w-full"
        disabled={disabled || isLoading}
        onClick={handleRegisterClick}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : isFull ? (
          "Entrar na Lista de Espera"
        ) : (
          "Inscrever-se no Evento"
        )}
      </Button>

      <ParticipantInfoDialog
        isLoading={isLoading}
        onOpenChange={setShowParticipantDialog}
        onSubmit={handleParticipantInfoSubmit}
        open={showParticipantDialog}
      />
    </>
  );
}
