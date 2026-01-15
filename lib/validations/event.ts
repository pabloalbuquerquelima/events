import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
    description: z
      .string()
      .min(10, "Descrição deve ter no mínimo 10 caracteres"),
    bannerUrl: z.string().optional().or(z.literal("")),
    category: z.enum([
      "workshop",
      "palestra",
      "seminario",
      "formacao",
      "congresso",
      "outro",
    ]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().min(3, "Local deve ter no mínimo 3 caracteres"),
    address: z.string().optional(),
    maxAttendees: z.coerce
      .number()
      .min(1, "Deve ter no mínimo 1 vaga")
      .max(10_000, "Número máximo de vagas: 10.000"),
    status: z
      .enum(["draft", "published", "ongoing", "completed", "cancelled"])
      .default("draft"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });

export const updateEventSchema = createEventSchema.partial();

export const publishEventSchema = z.object({
  id: z.string(),
});

export const deleteEventSchema = z.object({
  id: z.string(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
