import  z  from "zod";

export const eventStatusEnum = z.enum([
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
]);

export const eventCategoryEnum = z.enum([
  "workshop",
  "palestra",
  "seminario",
  "formacao",
  "congresso",
  "outro",
]);

export const createEventSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: eventCategoryEnum,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().min(3),
    maxAttendees: z.number().min(1),
    status: eventStatusEnum,
    bannerUrl: z.string().url().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });

export const updateEventSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    category: eventCategoryEnum.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    location: z.string().min(3).optional(),
    maxAttendees: z.number().min(1).optional(),
    status: eventStatusEnum.optional(),
    bannerUrl: z.string().url().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
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

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
