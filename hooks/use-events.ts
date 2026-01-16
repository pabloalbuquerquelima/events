"use client";

import { useState } from "react";
import { toast } from "sonner";

export interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  category: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  address?: string;
  maxAttendees: number;
  currentAttendees: number;
  status: string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

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
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.upcoming) params.append("upcoming", "true");
      if (filters?.past) params.append("past", "true");
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());

      const response = await fetch(`/api/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      return { success: true, events: data.events as Event[] };
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Erro ao buscar eventos");
      return { success: false, events: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const getEventById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const data = await response.json();
      return { success: true, event: data.event as Event };
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Erro ao buscar evento");
      return { success: false, event: null };
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }

      const data = await response.json();
      toast.success("Evento criado com sucesso!");
      return { success: true, event: data.event as Event };
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Erro ao criar evento");
      return { success: false, event: null };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update event");
      }

      const data = await response.json();
      toast.success("Evento atualizado com sucesso!");
      return { success: true, event: data.event as Event };
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Erro ao atualizar evento");
      return { success: false, event: null };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete event");
      }

      toast.success("Evento deletado com sucesso!");
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Erro ao deletar evento");
      return { success: false };
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
