import { describe, expect, it, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock database functions
vi.mock("./db", () => ({
  getDb: vi.fn(),
  createMeeting: vi.fn(),
  getMeetingByRoomCode: vi.fn(),
  getMeetingById: vi.fn(),
  getUserMeetings: vi.fn(),
  updateMeetingStatus: vi.fn(),
  addParticipant: vi.fn(),
  removeParticipant: vi.fn(),
  getMeetingParticipants: vi.fn(),
  createMessage: vi.fn(),
  getMeetingMessages: vi.fn(),
  addTeamMember: vi.fn(),
  getTeamMembers: vi.fn(),
}));

describe("Meeting Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createMeeting", () => {
    it("should create a meeting with required fields", async () => {
      const mockMeeting = {
        id: 1,
        title: "Team Standup",
        description: "Daily standup",
        createdBy: 1,
        roomCode: "ABC12345",
        status: "scheduled" as const,
        scheduledAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.createMeeting).mockResolvedValueOnce(mockMeeting);

      const result = await db.createMeeting({
        title: "Team Standup",
        description: "Daily standup",
        createdBy: 1,
        roomCode: "ABC12345",
      });

      expect(result).toEqual(mockMeeting);
      expect(db.createMeeting).toHaveBeenCalledWith({
        title: "Team Standup",
        description: "Daily standup",
        createdBy: 1,
        roomCode: "ABC12345",
      });
    });
  });

  describe("getMeetingByRoomCode", () => {
    it("should retrieve meeting by room code", async () => {
      const mockMeeting = {
        id: 1,
        title: "Team Standup",
        description: null,
        createdBy: 1,
        roomCode: "ABC12345",
        status: "active" as const,
        scheduledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getMeetingByRoomCode).mockResolvedValueOnce(mockMeeting);

      const result = await db.getMeetingByRoomCode("ABC12345");

      expect(result).toEqual(mockMeeting);
      expect(db.getMeetingByRoomCode).toHaveBeenCalledWith("ABC12345");
    });

    it("should return undefined if meeting not found", async () => {
      vi.mocked(db.getMeetingByRoomCode).mockResolvedValueOnce(undefined);

      const result = await db.getMeetingByRoomCode("INVALID");

      expect(result).toBeUndefined();
    });
  });

  describe("updateMeetingStatus", () => {
    it("should update meeting status", async () => {
      vi.mocked(db.updateMeetingStatus).mockResolvedValueOnce(undefined);

      await db.updateMeetingStatus(1, "active");

      expect(db.updateMeetingStatus).toHaveBeenCalledWith(1, "active");
    });
  });

  describe("Participants", () => {
    it("should add participant to meeting", async () => {
      vi.mocked(db.addParticipant).mockResolvedValueOnce(undefined);

      await db.addParticipant(1, 1);

      expect(db.addParticipant).toHaveBeenCalledWith(1, 1);
    });

    it("should remove participant from meeting", async () => {
      vi.mocked(db.removeParticipant).mockResolvedValueOnce(undefined);

      await db.removeParticipant(1, 1);

      expect(db.removeParticipant).toHaveBeenCalledWith(1, 1);
    });

    it("should get meeting participants", async () => {
      const mockParticipants = [
        {
          id: 1,
          meetingId: 1,
          userId: 1,
          joinedAt: new Date(),
          leftAt: null,
          status: "joined" as const,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getMeetingParticipants).mockResolvedValueOnce(mockParticipants);

      const result = await db.getMeetingParticipants(1);

      expect(result).toEqual(mockParticipants);
      expect(db.getMeetingParticipants).toHaveBeenCalledWith(1);
    });
  });

  describe("Messages", () => {
    it("should create a message", async () => {
      vi.mocked(db.createMessage).mockResolvedValueOnce(undefined);

      await db.createMessage(1, 1, "Hello team!", "text");

      expect(db.createMessage).toHaveBeenCalledWith(1, 1, "Hello team!", "text");
    });

    it("should get meeting messages", async () => {
      const mockMessages = [
        {
          id: 1,
          meetingId: 1,
          userId: 1,
          content: "Hello team!",
          type: "text" as const,
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getMeetingMessages).mockResolvedValueOnce(mockMessages);

      const result = await db.getMeetingMessages(1, 50);

      expect(result).toEqual(mockMessages);
      expect(db.getMeetingMessages).toHaveBeenCalledWith(1, 50);
    });
  });

  describe("Team Members", () => {
    it("should add team member", async () => {
      vi.mocked(db.addTeamMember).mockResolvedValueOnce(undefined);

      await db.addTeamMember(1, 1, "member");

      expect(db.addTeamMember).toHaveBeenCalledWith(1, 1, "member");
    });

    it("should get team members", async () => {
      const mockTeamMembers = [
        {
          id: 1,
          userId: 1,
          teamId: 1,
          role: "owner" as const,
          joinedAt: new Date(),
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getTeamMembers).mockResolvedValueOnce(mockTeamMembers);

      const result = await db.getTeamMembers(1);

      expect(result).toEqual(mockTeamMembers);
      expect(db.getTeamMembers).toHaveBeenCalledWith(1);
    });
  });
});
