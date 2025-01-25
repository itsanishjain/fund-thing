import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  uid: uuid("uid").defaultRandom(),
  walletAddress: text("wallet_address").unique(), // Add unique constraint
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const beneficiaries = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  trustPercentage: text("trust_percentage"),
  relationship: text("relationship"),
  phoneNumber: text("phone_number"),
  accountId: integer("account_id"), // Optionally keep accountId
  accountWalletAddress: text("accountWalletAddress"),
  status: text("status").default("sent"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const notificationSettings = pgTable("notification_settings", {
  enabled: boolean("enabled").default(true).notNull(),
  checkFrequency: integer("check_frequency").notNull(), // number of units
  checkFrequencyUnit: text("check_frequency_unit").notNull(), // "days" or "months"
  numberOfAlerts: integer("number_of_alerts").notNull(),
  lastChecked: timestamp("last_checked"),
  alertsSent: integer("alerts_sent").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create relationships
export const usersRelations = relations(accounts, ({ many }) => ({
  beneficiaries: many(beneficiaries),
}));
