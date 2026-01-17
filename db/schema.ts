import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof user.$inferSelect;

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
]);

export const eventCategoryEnum = pgEnum("event_category", [
  "workshop",
  "palestra",
  "seminario",
  "formacao",
  "congresso",
  "outro",
]);

export const event = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bannerUrl: text("banner_url"),
  category: eventCategoryEnum("category").default("outro").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  location: text("location").notNull(),
  address: text("address"),

  maxAttendees: integer("max_attendees").notNull(),
  currentAttendees: integer("current_attendees").default(0).notNull(),

  status: eventStatusEnum("status").default("draft").notNull(),

  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/* =======================
 * INSCRIÇÕES
 * ======================= */

export const registrationStatusEnum = pgEnum("registration_status", [
  "confirmed",
  "attended",
  "cancelled",
]);

export const registration = pgTable("registration", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  attendeesCount: integer("attendees_count").default(1).notNull(),
  status: registrationStatusEnum("status").default("confirmed").notNull(),

  qrCode: text("qr_code").notNull().unique(),
  checkedInAt: timestamp("checked_in_at"),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  eventId: text("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  position: integer("position").notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/* =======================
 * INFORMAÇÕES DOS PARTICIPANTES
 * ======================= */

export const participantInfo = pgTable(
  "participant_info",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    registrationId: text("registration_id")
      .notNull()
      .references(() => registration.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    cpf: text("cpf").notNull(),
    municipality: text("municipality").notNull(),
    state: text("state").notNull(),
    contact: text("contact").notNull(),
    email: text("email").notNull(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Unique constraint - cada registration só pode ter um participantInfo
    uniqueRegistration: unique().on(table.registrationId),
    // Índices para melhorar performance de queries
    registrationIdx: index("idx_participant_info_registration").on(
      table.registrationId
    ),
    cpfIdx: index("idx_participant_info_cpf").on(table.cpf),
    emailIdx: index("idx_participant_info_email").on(table.email),
  })
);

/* =======================
 * RELATIONS
 * ======================= */

export const eventRelations = relations(event, ({ one, many }) => ({
  creator: one(user, {
    fields: [event.createdBy],
    references: [user.id],
  }),
  registrations: many(registration),
  waitlist: many(waitlist),
}));

export const registrationRelations = relations(registration, ({ one }) => ({
  event: one(event, {
    fields: [registration.eventId],
    references: [event.id],
  }),
  user: one(user, {
    fields: [registration.userId],
    references: [user.id],
  }),
  // ✅ NOVA RELAÇÃO: 1:1 com participantInfo
  participantInfo: one(participantInfo, {
    fields: [registration.id],
    references: [participantInfo.registrationId],
  }),
}));

export const participantInfoRelations = relations(
  participantInfo,
  ({ one }) => ({
    registration: one(registration, {
      fields: [participantInfo.registrationId],
      references: [registration.id],
    }),
  })
);

export const waitlistRelations = relations(waitlist, ({ one }) => ({
  event: one(event, {
    fields: [waitlist.eventId],
    references: [event.id],
  }),
  user: one(user, {
    fields: [waitlist.userId],
    references: [user.id],
  }),
}));

/* =======================
 * TYPES
 * ======================= */

export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;

export type Registration = typeof registration.$inferSelect;
export type NewRegistration = typeof registration.$inferInsert;

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;

export type ParticipantInfo = typeof participantInfo.$inferSelect;
export type NewParticipantInfo = typeof participantInfo.$inferInsert;

/* =======================
 * SCHEMA EXPORT
 * ======================= */

export const schema = {
  user,
  session,
  account,
  verification,
  event,
  registration,
  waitlist,
  participantInfo,
  eventRelations,
  registrationRelations,
  waitlistRelations,
  participantInfoRelations,
};
