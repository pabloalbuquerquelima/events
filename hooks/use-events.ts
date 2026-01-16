"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Event as DbEvent, NewEvent } from "@/db/schema";

export type Event = DbEvent & {
  creator?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export function useEvents() {
  const [isLoading, setIsLoading] = useState(false);

  const getEvents = async (filters?: {
    status?: string;
    category?: string;
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.upcoming) params.append("upcoming", "true");
      if (filters?.past) params.append("past", "true");
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());

      const response = await fetch(`/api/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar eventos");
      }

      const data = await response.json();

      return {
        success: true,
        events: data.events || [],
        error: null,
      };
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Erro ao buscar eventos");
      return {
        success: false,
        events: [],
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getEventById = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        throw new Error("Evento não encontrado");
      }

      const data = await response.json();

      return {
        success: true,
        event: data.event,
        error: null,
      };
    } catch (error: any) {
      console.error("Error fetching event:", error);
      toast.error(error.message || "Erro ao buscar evento");
      return {
        success: false,
        event: null,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (data: NewEvent) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar evento");
      }

      toast.success("Evento criado com sucesso!");
      return {
        success: true,
        event: result.event,
        error: null,
      };
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Erro ao criar evento");
      return {
        success: false,
        event: null,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (eventId: string, data: Partial<NewEvent>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar evento");
      }

      toast.success("Evento atualizado com sucesso!");
      return {
        success: true,
        event: result.event,
        error: null,
      };
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Erro ao atualizar evento");
      return {
        success: false,
        event: null,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro ao deletar evento");
      }

      toast.success("Evento deletado com sucesso!");
      return {
        success: true,
        error: null,
      };
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Erro ao deletar evento");
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
