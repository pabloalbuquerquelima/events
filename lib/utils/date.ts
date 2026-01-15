import {
  format,
  formatDistance,
  formatRelative,
  isAfter,
  isBefore,
  isPast,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatEventDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatEventTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "HH:mm", { locale: ptBR });
}

export function formatEventDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatEventDateTimeFull(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatRelative(d, new Date(), { locale: ptBR });
}

export function formatDistanceFromNow(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true, locale: ptBR });
}

export function isEventUpcoming(startDate: Date | string): boolean {
  const d = typeof startDate === "string" ? new Date(startDate) : startDate;
  return isAfter(d, new Date());
}

export function isEventPast(endDate: Date | string): boolean {
  const d = typeof endDate === "string" ? new Date(endDate) : endDate;
  return isPast(d);
}

export function isEventOngoing(
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  return isAfter(now, start) && isBefore(now, end);
}

export function getEventStatus(
  startDate: Date | string,
  endDate: Date | string
): "upcoming" | "ongoing" | "past" {
  if (isEventOngoing(startDate, endDate)) {
    return "ongoing";
  }
  if (isEventPast(endDate)) {
    return "past";
  }
  return "upcoming";
}
