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
    location: z.string().min(3, "Local é obrigatório"),
    address: z.string().optional(),
    maxAttendees: z.number().min(1, "Deve ter pelo menos 1 vaga"),
    status: z.enum(["draft", "published", "ongoing", "completed", "cancelled"]),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(3, "Título deve ter no mínimo 3 caracteres")
      .optional(),
    description: z
      .string()
      .min(10, "Descrição deve ter no mínimo 10 caracteres")
      .optional(),
    bannerUrl: z.string().optional().or(z.literal("")),
    category: z
      .enum([
        "workshop",
        "palestra",
        "seminario",
        "formacao",
        "congresso",
        "outro",
      ])
      .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    location: z.string().min(3, "Local é obrigatório").optional(),
    address: z.string().optional(),
    maxAttendees: z.number().min(1, "Deve ter pelo menos 1 vaga").optional(),
    status: z
      .enum(["draft", "published", "ongoing", "completed", "cancelled"])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "Data de término deve ser posterior à data de início",
      path: ["endDate"],
    }
  );

export const publishEventSchema = z.object({
  id: z.string(),
  status: z.literal("published"),
});

export const cancelEventSchema = z.object({
  id: z.string(),
  status: z.literal("cancelled"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PublishEventInput = z.infer<typeof publishEventSchema>;
export type CancelEventInput = z.infer<typeof cancelEventSchema>;
