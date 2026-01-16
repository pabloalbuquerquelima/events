"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRegistrations } from "@/hooks/use-registrations";
import { authClient } from "@/lib/auth-client";

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

  const handleRegister = async () => {
    if (!session?.user) {
      router.push(`/login?redirect=/eventos/${eventId}`);
      return;
    }

    const result = await registerForEvent(eventId, 1);

    if (result.success) {
      if (result.registration) {
        router.push("/painel/minhas-inscricoes");
      } else {
        router.refresh();
      }
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
      <Button className="w-full" onClick={handleRegister} size="lg">
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
    <Button
      className="w-full"
      disabled={disabled || isLoading}
      onClick={handleRegister}
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
  );
}
