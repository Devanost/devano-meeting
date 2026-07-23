import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { getInitials, formatMessageTime } from "@/lib/formatting";

interface Participant {
  id: number;
  userId: number;
  userName?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  joinedAt: Date;
}

interface ParticipantListProps {
  participants: Participant[];
  currentUserId?: number;
}

export function ParticipantList({ participants, currentUserId }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <Card className="bg-card border border-border p-4">
        <p className="text-sm text-muted-foreground text-center">No participants yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((participant) => (
        <Card
          key={participant.id}
          className="bg-card border border-border p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                {getInitials(participant.userName || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {participant.userName || `User ${participant.userId}`}
                {currentUserId === participant.userId && (
                  <span className="text-xs text-muted-foreground ml-2">(You)</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Joined {formatMessageTime(participant.joinedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {participant.isMuted ? (
              <MicOff className="w-4 h-4 text-destructive" />
            ) : (
              <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
            {participant.isVideoOff ? (
              <VideoOff className="w-4 h-4 text-destructive" />
            ) : (
              <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
