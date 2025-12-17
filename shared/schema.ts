import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const ratioEntries = pgTable("ratio_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  upload: real("upload").notNull(),
  download: real("download").notNull(),
  ratio: real("ratio").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertRatioEntrySchema = createInsertSchema(ratioEntries).omit({
  id: true,
  recordedAt: true,
});

export type InsertRatioEntry = z.infer<typeof insertRatioEntrySchema>;
export type RatioEntry = typeof ratioEntries.$inferSelect;

export const ratioInputSchema = z.object({
  upload: z.number().min(0, "L'upload doit être positif"),
  download: z.number().min(0.001, "Le download doit être supérieur à 0"),
});

export type RatioInput = z.infer<typeof ratioInputSchema>;

export const goalCalculatorSchema = z.object({
  currentUpload: z.number().min(0),
  currentDownload: z.number().min(0.001),
  targetRatio: z.number().min(0.1).max(10),
});

export type GoalCalculator = z.infer<typeof goalCalculatorSchema>;

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action?: string;
  icon: string;
}

export interface RatioStats {
  currentRatio: number;
  upload: number;
  download: number;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}
