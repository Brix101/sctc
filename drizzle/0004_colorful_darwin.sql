ALTER TABLE "courses" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "materials" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;