CREATE TABLE IF NOT EXISTS "notification_settings" (
	"enabled" boolean DEFAULT true NOT NULL,
	"check_frequency" integer NOT NULL,
	"check_frequency_unit" text NOT NULL,
	"number_of_alerts" integer NOT NULL,
	"last_checked" timestamp,
	"alerts_sent" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
