import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantList } from "@/components/ParticipantList";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Phone, Send, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatMessageTime } from "@/lib/formatting";

export default function MeetingRoom() {
  const [, params] = useRoute("/meeting/:roomCode");
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const roomCode = params?.roomCode as string;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch meeting details
  const { data: meeting } = trpc.meetings.getByRoomCode.useQuery(
    { roomCode },
    { enabled: !!roomCode }
  );

  // Fetch participants
  const { data: meetingParticipants } = trpc.participants.list.useQuery(
    { meetingId: meeting?.id || 0 },
    { enabled: !!meeting?.id, refetchInterval: 2000 }
  );

  // Fetch messages
  const { data: meetingMessages } = trpc.messages.list.useQuery(
    { meetingId: meeting?.id || 0, limit: 50 },
    { enabled: !!meeting?.id, refetchInterval: 1000 }
  );

  // Add participant mutation
  const addParticipantMutation = trpc.participants.add.useMutation();

  // Send message mutation
  const sendMessageMutation = trpc.messages.create.useMutation({
    onSuccess: () => {
      setMessageInput("");
    },
  });

  // Initialize video stream
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error("Unable to access camera/microphone");
        setIsLoading(false);
      }
    };

    if (isAuthenticated && meeting) {
      initializeVideo();
      addParticipantMutation.mutate({ meetingId: meeting.id });
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isAuthenticated, meeting]);

  // Update participants list
  useEffect(() => {
    if (meetingParticipants) {
      setParticipants(meetingParticipants);
    }
  }, [meetingParticipants]);

  // Update messages
  useEffect(() => {
    if (meetingMessages) {
      setMessages(meetingMessages);
    }
  }, [meetingMessages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleLeaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    navigate("/dashboard");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !meeting) return;
    sendMessageMutation.mutate({
      meetingId: meeting.id,
      content: messageInput,
      type: "text",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing meeting...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card border border-border p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Meeting Not Found</h2>
          <p className="text-muted-foreground mb-6">The meeting room code is invalid or expired.</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{meeting.title}</h1>
            <p className="text-sm text-muted-foreground">Room Code: {meeting.roomCode}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">{participants.length} participant{participants.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col bg-background">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              {/* Local Video */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                  {user?.name || "You"} {isVideoOff && "(Video Off)"}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleToggleMic}
                  variant={isMuted ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={handleToggleVideo}
                  variant={isVideoOff ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={handleLeaveCall}
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-14 h-14 p-0"
                >
                  <Phone className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat & Participants Sidebar */}
        <div className="w-96 border-l border-border bg-card flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent">
              <TabsTrigger value="chat" className="gap-2 flex-1">
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="gap-2 flex-1">
                <Users className="w-4 h-4" />
                Participants ({participants.length})
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          {msg.userId === user?.id ? "You" : `User ${msg.userId}`}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-3 text-sm text-foreground break-words">
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !messageInput.trim()}
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="flex-1 overflow-y-auto m-0 p-4">
              <ParticipantList participants={participants} currentUserId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
