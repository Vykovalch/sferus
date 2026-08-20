CREATE TYPE "public"."reveal_target" AS ENUM('service', 'task', 'profile');--> statement-breakpoint
CREATE TABLE "contact_reveals" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contact_reveals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"target_kind" "reveal_target" NOT NULL,
	"target_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_reveals" ADD CONSTRAINT "contact_reveals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_reveals" ADD CONSTRAINT "contact_reveals_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_reveals_user_created_idx" ON "contact_reveals" USING btree ("user_id","created_at");