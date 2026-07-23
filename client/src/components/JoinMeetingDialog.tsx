import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { LogIn } from "lucide-react";
import { toast } from "sonner";

export function JoinMeetingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [, navigate] = useLocation();
  const [isSearching, setIsSearching] = useState(false);

  const handleJoin = () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }
    setIsSearching(true);
    try {
      setRoomCode("");
      setIsOpen(false);
      navigate(`/meeting/${roomCode.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to join meeting. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LogIn className="w-4 h-4" />
          Join Meeting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              placeholder="e.g., ABC12345"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleJoin();
                }
              }}
              disabled={isSearching}
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Ask the meeting organizer for the room code
            </p>
          </div>
          <Button
            onClick={handleJoin}
            disabled={isSearching || !roomCode.trim()}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSearching ? "Joining..." : "Join Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
