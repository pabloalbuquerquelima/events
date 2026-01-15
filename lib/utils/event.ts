export function calculateAvailableSpots(
  maxAttendees: number,
  currentAttendees: number
): number {
  return Math.max(0, maxAttendees - currentAttendees);
}

export function calculateOccupancyRate(
  maxAttendees: number,
  currentAttendees: number
): number {
  if (maxAttendees === 0) {
    return 0;
  }
  return Math.round((currentAttendees / maxAttendees) * 100);
}

export function isEventFull(
  maxAttendees: number,
  currentAttendees: number
): boolean {
  return currentAttendees >= maxAttendees;
}

export function isEventAlmostFull(
  maxAttendees: number,
  currentAttendees: number,
  threshold = 0.9
): boolean {
  return currentAttendees / maxAttendees >= threshold;
}

export function getEventCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    workshop: "Workshop",
    palestra: "Palestra",
    seminario: "Seminário",
    formacao: "Formação",
    congresso: "Congresso",
    outro: "Outro",
  };
  return labels[category] || category;
}

export function getEventStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    published: "Publicado",
    ongoing: "Em Andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
}

export function getEventStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    draft: "outline",
    published: "default",
    ongoing: "secondary",
    completed: "secondary",
    cancelled: "destructive",
  };
  return variants[status] || "default";
}

export function getRegistrationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    confirmed: "Confirmado",
    attended: "Compareceu",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
}

export function getRegistrationStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    confirmed: "default",
    attended: "secondary",
    cancelled: "destructive",
  };
  return variants[status] || "default";
}
