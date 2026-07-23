import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Calendar, Users, Clock } from "lucide-react";
import { JoinMeetingDialog } from "@/components/JoinMeetingDialog";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: meetings, isLoading } = trpc.meetings.getUserMeetings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMeetingMutation = trpc.meetings.create.useMutation({
    onSuccess: (data) => {
      toast.success("Meeting created! Redirecting...");
      setTitle("");
      setDescription("");
      setIsOpen(false);
      setTimeout(() => {
        navigate(`/meeting/${data.roomCode}`);
      }, 500);
    },
    onError: (error) => {
      toast.error("Failed to create meeting: " + error.message);
    },
  });

  const handleCreateMeeting = () => {
    if (!title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }
    createMeetingMutation.mutate({
      title,
      description,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || "Team"}!</h1>
            <p className="text-muted-foreground mt-2">Manage your meetings and collaborate with your team</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Plus className="w-4 h-4" />
                  New Meeting
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    placeholder="Team Standup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={createMeetingMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Discuss project updates and blockers"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={createMeetingMutation.isPending}
                  />
                </div>
                <Button
                  onClick={handleCreateMeeting}
                  disabled={createMeetingMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {createMeetingMutation.isPending ? "Creating..." : "Create Meeting"}
                </Button>
              </div>
            </DialogContent>
            </Dialog>
            <JoinMeetingDialog />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Meetings</p>
                <p className="text-3xl font-bold text-foreground">{meetings?.length || 0}</p>
              </div>
              <Calendar className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-foreground">
                  {meetings?.filter((m) => m.status === "scheduled").length || 0}
                </p>
              </div>
              <Clock className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Team Members</p>
                <p className="text-3xl font-bold text-foreground">Coming Soon</p>
              </div>
              <Users className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>
        </div>

        {/* Meetings List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Meetings</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card border border-border h-20 animate-pulse" />
              ))}
            </div>
          ) : meetings && meetings.length > 0 ? (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  className="bg-card border border-border p-4 hover:border-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/meeting/${meeting.roomCode}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Room Code: <span className="font-mono font-bold">{meeting.roomCode}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        meeting.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : meeting.status === "scheduled"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No meetings yet. Create one to get started!</p>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Meeting
              </Button>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
