import { pgTable, text, timestamp, serial, uuid } from "drizzle-orm/pg-core";

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
