import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  description: text("description"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert

export const coursesRelations = relations(courses, ({ many }) => ({
  topics: many(topics),
}))

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  urlId: varchar("url_id", { length: 100 }),
  videoLink: text("video_link"),
  details: text("details"),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Topic = typeof topics.$inferSelect
export type NewTopic = typeof topics.$inferInsert

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, {
    fields: [topics.courseId],
    references: [courses.id],
  }),
  materials: many(materials),
}))

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).default(""),
  link: text("link"),
  topicId: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Material = typeof materials.$inferSelect
export type NewMaterial = typeof materials.$inferInsert

export const materialsRelations = relations(materials, ({ one }) => ({
  topic: one(topics, {
    fields: [materials.topicId],
    references: [topics.id],
  }),
}))
