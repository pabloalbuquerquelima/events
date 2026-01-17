"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "./use-events";

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  attendeesCount: number;
  status: string;
  qrCode: string;
  checkedInAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  event?: Event;
  participantInfo?: ParticipantInfo;
}

export interface ParticipantInfo {
  id: string;
  registrationId: string;
  name: string;
  cpf: string;
  municipality: string;
  state: string;
  contact: string;
  email: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Waitlist {
  id: string;
  eventId: string;
  userId: string;
  position: number;
  createdAt: Date | string;
}

export function useRegistrations() {
  const [isLoading, setIsLoading] = useState(false);

  const getMyRegistrations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/registrations");

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      return {
        success: true,
        registrations: data.registrations as Registration[],
      };
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Erro ao buscar inscrições");
      return { success: false, registrations: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const checkRegistration = async (eventId: string) => {
    try {
      const response = await fetch("/api/registrations/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Failed to check registration");
      }

      const data = await response.json();
      return {
        success: true,
        isRegistered: data.isRegistered,
        isOnWaitlist: data.isOnWaitlist,
        registration: data.registration as Registration | null,
        waitlist: data.waitlist as Waitlist | null,
      };
    } catch (error) {
      console.error("Error checking registration:", error);
      return {
        success: false,
        isRegistered: false,
        isOnWaitlist: false,
        registration: null,
        waitlist: null,
      };
    }
  };

  const registerForEvent = async (
    eventId: string,
    attendeesCount = 1,
    participantData?: {
      name: string;
      cpf: string;
      municipality: string;
      state: string;
      contact: string;
      email: string;
    }
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, attendeesCount, participantData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      if (data.registration) {
        toast.success("Inscrição realizada com sucesso!");
      } else if (data.waitlist) {
        toast.success(
          `Adicionado à lista de espera na posição ${data.waitlist.position}!`
        );
      }

      return {
        success: true,
        registration: data.registration as Registration | null,
        waitlist: data.waitlist as Waitlist | null,
      };
    } catch (error: any) {
      console.error("Error registering for event:", error);
      toast.error(error.message || "Erro ao realizar inscrição");
      return {
        success: false,
        registration: null,
        waitlist: null,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRegistration = async (registrationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel registration");
      }

      toast.success("Inscrição cancelada com sucesso!");
      return { success: true };
    } catch (error: any) {
      console.error("Error cancelling registration:", error);
      toast.error(error.message || "Erro ao cancelar inscrição");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getMyRegistrations,
    checkRegistration,
    registerForEvent,
    cancelRegistration,
  };
}
