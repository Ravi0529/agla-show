CREATE TYPE "public"."booking_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";