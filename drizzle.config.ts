import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["callmebymyname*"],
} satisfies Config;
