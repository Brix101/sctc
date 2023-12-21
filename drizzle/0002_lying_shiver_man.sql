ALTER TABLE "materials" DROP CONSTRAINT "materials_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "topics" DROP CONSTRAINT "topics_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "materials" ALTER COLUMN "topic_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "course_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials" ADD CONSTRAINT "materials_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topics" ADD CONSTRAINT "topics_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
