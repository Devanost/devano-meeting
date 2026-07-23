import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, meetings, meetingParticipants, messages, teamMembers } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Meeting queries
export async function createMeeting(data: { title: string; description?: string; createdBy: number; roomCode: string; scheduledAt?: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(meetings).values(data);
  return result;
}

export async function getMeetingByRoomCode(roomCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(meetings).where(eq(meetings.roomCode, roomCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMeetingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(meetings).where(eq(meetings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserMeetings(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(meetings).where(eq(meetings.createdBy, userId)).orderBy(desc(meetings.createdAt));
  return result;
}

export async function updateMeetingStatus(meetingId: number, status: "scheduled" | "active" | "ended") {
  const db = await getDb();
  if (!db) return;
  
  await db.update(meetings).set({ status }).where(eq(meetings.id, meetingId));
}

// Meeting participant queries
export async function addParticipant(meetingId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(meetingParticipants).values({ meetingId, userId, status: "joined" });
}

export async function removeParticipant(meetingId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(meetingParticipants).set({ status: "left", leftAt: new Date() }).where(and(eq(meetingParticipants.meetingId, meetingId), eq(meetingParticipants.userId, userId)));
}

export async function getMeetingParticipants(meetingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(meetingParticipants).where(and(eq(meetingParticipants.meetingId, meetingId), eq(meetingParticipants.status, "joined")));
  return result;
}

// Message queries
export async function createMessage(meetingId: number, userId: number, content: string, type: "text" | "emoji" | "system" = "text") {
  const db = await getDb();
  if (!db) return;
  
  const result = await db.insert(messages).values({ meetingId, userId, content, type });
  return result;
}

export async function getMeetingMessages(meetingId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(messages).where(eq(messages.meetingId, meetingId)).orderBy(desc(messages.createdAt)).limit(limit);
  return result.reverse();
}

// Team member queries
export async function addTeamMember(userId: number, teamId: number, role: "owner" | "member" | "admin" = "member") {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(teamMembers).values({ userId, teamId, role });
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  return result;
}
