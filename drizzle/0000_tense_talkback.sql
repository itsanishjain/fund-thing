CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" text,
	"email" text NOT NULL,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beneficiaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"trust_percentage" text,
	"relationship" text,
	"phone_number" text,
	"account_id" integer,
	"accountWalletAddress" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "beneficiaries" ADD CONSTRAINT "beneficiaries_accountWalletAddress_accounts_wallet_address_fk" FOREIGN KEY ("accountWalletAddress") REFERENCES "public"."accounts"("wallet_address") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
