import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Meetings table - stores meeting information
 */
export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  scheduledAt: timestamp("scheduledAt"),
  roomCode: varchar("roomCode", { length: 20 }).notNull().unique(),
  status: mysqlEnum("status", ["scheduled", "active", "ended"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;

/**
 * Meeting participants - tracks who is in each meeting
 */
export const meetingParticipants = mysqlTable("meeting_participants", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: int("meetingId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  leftAt: timestamp("leftAt"),
  status: mysqlEnum("status", ["joined", "left", "invited"]).default("joined").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MeetingParticipant = typeof meetingParticipants.$inferSelect;
export type InsertMeetingParticipant = typeof meetingParticipants.$inferInsert;

/**
 * Team members - manages team membership
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
  role: mysqlEnum("role", ["owner", "member", "admin"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Chat messages - stores real-time chat messages in meetings
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: int("meetingId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["text", "emoji", "system"]).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
