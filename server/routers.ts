import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Meetings router
  meetings: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        scheduledAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const result = await db.createMeeting({
          title: input.title,
          description: input.description,
          createdBy: ctx.user.id,
          roomCode,
          scheduledAt: input.scheduledAt,
        });
        return { roomCode, success: true };
      }),

    getByRoomCode: publicProcedure
      .input(z.object({ roomCode: z.string() }))
      .query(async ({ input }) => {
        return await db.getMeetingByRoomCode(input.roomCode);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMeetingById(input.id);
      }),

    getUserMeetings: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserMeetings(ctx.user.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        meetingId: z.number(),
        status: z.enum(["scheduled", "active", "ended"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateMeetingStatus(input.meetingId, input.status);
        return { success: true };
      }),
  }),

  // Participants router
  participants: router({
    add: protectedProcedure
      .input(z.object({ meetingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.addParticipant(input.meetingId, ctx.user.id);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ meetingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeParticipant(input.meetingId, ctx.user.id);
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({ meetingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMeetingParticipants(input.meetingId);
      }),
  }),

  // Messages router
  messages: router({
    create: protectedProcedure
      .input(z.object({
        meetingId: z.number(),
        content: z.string().min(1),
        type: z.enum(["text", "emoji", "system"]).default("text"),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createMessage(input.meetingId, ctx.user.id, input.content, input.type);
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({ meetingId: z.number(), limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await db.getMeetingMessages(input.meetingId, input.limit);
      }),
  }),

  // Team members router
  teamMembers: router({
    add: protectedProcedure
      .input(z.object({
        userId: z.number(),
        teamId: z.number(),
        role: z.enum(["owner", "member", "admin"]).default("member"),
      }))
      .mutation(async ({ input }) => {
        await db.addTeamMember(input.userId, input.teamId, input.role);
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({ teamId: z.number() }))
      .query(async ({ input }) => {
        return await db.getTeamMembers(input.teamId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
