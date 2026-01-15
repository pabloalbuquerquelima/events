"use client";

import { Button } from "@/components/ui/button";
import { registerForEvent } from "@/server/registrations";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RegistrationButtonProps {
  eventId: string;
  isRegistered: boolean;
  isOnWaitlist: boolean;
  isFull: boolean;
  disabled?: boolean;
}

export function RegistrationButton({
  eventId,
  isRegistered,
  isOnWaitlist,
  isFull,
  disabled,
}: RegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      const result = await registerForEvent(eventId, 1);

      if (result.success) {
        if (result.registration) {
          toast.success("Inscrição realizada com sucesso!");
          router.push("/painel/minhas-inscricoes");
        } else if (result.waitlist) {
          toast.success(
            `Você foi adicionado à lista de espera na posição ${result.waitlist.position}!`
          );
          router.refresh();
        }
      } else {
        toast.error(result.error || "Erro ao realizar inscrição.");
      }
    } catch (error) {
      toast.error("Erro ao realizar inscrição.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <Button className="w-full" disabled size="lg">
        Você já está inscrito
      </Button>
    );
  }

  if (isOnWaitlist) {
    return (
      <Button className="w-full" disabled size="lg">
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
