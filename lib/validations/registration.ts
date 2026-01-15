import { z } from "zod";

export const registerForEventSchema = z.object({
  eventId: z.string().uuid("ID do evento inválido"),
  attendeesCount: z.coerce
    .number()
    .min(1, "Número de participantes deve ser no mínimo 1")
    .max(10, "Número máximo de participantes: 10")
    .default(1),
});

export const cancelRegistrationSchema = z.object({
  registrationId: z.string().uuid("ID da inscrição inválido"),
});

export const checkInRegistrationSchema = z.object({
  registrationId: z.string().uuid("ID da inscrição inválido"),
});

export const verifyQRCodeSchema = z.object({
  qrData: z.string().min(1, "Dados do QR code inválidos"),
});

export type RegisterForEventInput = z.infer<typeof registerForEventSchema>;
