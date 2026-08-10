CREATE TYPE "public"."contact_channel" AS ENUM('phone', 'whatsapp', 'telegram', 'viber');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'rejected', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."price_unit" AS ENUM('hour', 'job', 'day', 'sqm', 'unit');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('individual', 'company');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('open', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "favorites_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"service_id" bigint,
	"task_id" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_exactly_one_target" CHECK (("favorites"."service_id" IS NOT NULL AND "favorites"."task_id" IS NULL) OR ("favorites"."service_id" IS NULL AND "favorites"."task_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "profile_contacts" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profile_contacts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" bigint NOT NULL,
	"channel" "contact_channel" NOT NULL,
	"value" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_images" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "service_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"service_id" bigint NOT NULL,
	"url" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "responses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "responses" CASCADE;--> statement-breakpoint
DROP TABLE "reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "city_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "budget" SET DATA TYPE integer;--> statement-breakpoint
-- ПРАВКА ВРУЧНУЮ. Автогенерация выдавала здесь два нерабочих оператора:
--   1) SET DEFAULT 'open'::task_status до смены типа — колонка ещё integer,
--      PostgreSQL отвергает default несовместимого типа;
--   2) USING "status"::task_status — приведения integer → enum не существует.
-- Порядок ниже: снять default, сменить тип через CASE, вернуть default.
-- Отображение чисел условно: колонка имела DEFAULT 1, но код в неё никогда
-- не писал, и на момент миграции таблица пуста.
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "public"."task_status" USING (CASE "status" WHEN 1 THEN 'open' WHEN 2 THEN 'completed' WHEN 3 THEN 'cancelled' ELSE 'open' END)::"public"."task_status";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "city_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
-- ПРАВКА ВРУЧНУЮ. Автогенерация выдавала ADD COLUMN "slug" text NOT NULL,
-- что падает на восьми существующих городах: значения по умолчанию нет.
-- Колонка добавляется nullable, заполняется поимённо, затем ужесточается.
-- Слаги согласованы отдельно; id 1–8 сверены с фактическим содержимым таблицы.
ALTER TABLE "cities" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'tiraspol'    WHERE "id" = 1;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'bendery'     WHERE "id" = 2;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'rybnitsa'    WHERE "id" = 3;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'dubossary'   WHERE "id" = 4;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'slobodzeya'  WHERE "id" = 5;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'dnestrovsk'  WHERE "id" = 6;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'grigoriopol' WHERE "id" = 7;--> statement-breakpoint
UPDATE "cities" SET "slug" = 'kamenka'     WHERE "id" = 8;--> statement-breakpoint
ALTER TABLE "cities" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "type" "profile_type" DEFAULT 'individual' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "experience_years" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_negotiable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "price_unit" "price_unit" DEFAULT 'hour' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "home_visit" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "moderation_status" "moderation_status" DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "is_negotiable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "moderation_status" "moderation_status" DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_contacts" ADD CONSTRAINT "profile_contacts_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_service_uq" ON "favorites" USING btree ("user_id","service_id") WHERE "favorites"."service_id" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_task_uq" ON "favorites" USING btree ("user_id","task_id") WHERE "favorites"."task_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "favorites_user_created_idx" ON "favorites" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_contacts_profile_channel_uq" ON "profile_contacts" USING btree ("profile_id","channel");--> statement-breakpoint
CREATE INDEX "service_images_service_idx" ON "service_images" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "profiles_city_idx" ON "profiles" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "services_city_idx" ON "services" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "services_user_idx" ON "services" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "services_visibility_idx" ON "services" USING btree ("is_active","moderation_status");--> statement-breakpoint
CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "tasks_category_idx" ON "tasks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tasks_city_idx" ON "tasks" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "tasks_user_idx" ON "tasks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_created_at_idx" ON "tasks" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "services" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_price_or_negotiable" CHECK ("services"."price" IS NOT NULL OR "services"."is_negotiable");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_budget_or_negotiable" CHECK ("tasks"."budget" IS NOT NULL OR "tasks"."is_negotiable");