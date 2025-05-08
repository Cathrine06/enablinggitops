import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// Repository schema for Git repositories
export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  branch: text("branch").notNull().default("main"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRepositorySchema = createInsertSchema(repositories).pick({
  name: true,
  url: true,
  branch: true,
});

// Application schema for managed applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  repoId: integer("repo_id").notNull(),
  path: text("path").notNull(),
  environment: text("environment").notNull(),
  status: text("status").notNull().default("unknown"),
  health: text("health").notNull().default("unknown"),
  version: text("version"),
  pods: text("pods"),
  syncStatus: text("sync_status").notNull().default("OutOfSync"),
  lastSyncedAt: timestamp("last_synced_at"),
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  repoId: true,
  path: true,
  environment: true,
  status: true,
  health: true,
  version: true,
  pods: true,
  syncStatus: true,
});

// Deployment history for tracking deployments
export const deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  revision: text("revision").notNull(),
  status: text("status").notNull(),
  initiatedBy: text("initiated_by").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
  message: text("message"),
  details: jsonb("details"),
});

export const insertDeploymentSchema = createInsertSchema(deployments).pick({
  applicationId: true,
  revision: true,
  status: true,
  initiatedBy: true,
  message: true,
  details: true,
});

// Activity log for all system activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: integer("user_id"),
  applicationId: integer("application_id"),
  deploymentId: integer("deployment_id"),
  description: text("description").notNull(),
  details: jsonb("details"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  userId: true,
  applicationId: true,
  deploymentId: true, 
  description: true,
  details: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Additional types for the frontend
export type SyncResult = {
  success: boolean;
  message: string;
  applicationName: string;
  revision?: string;
};

export type ClusterHealth = {
  healthy: boolean;
  percentage: number;
  trend: number;
  message?: string;
};
