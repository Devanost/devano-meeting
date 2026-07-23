import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Users, Clock, Download } from "lucide-react";
import { formatDuration, formatMeetingDate } from "@/lib/formatting";

export default function MeetingHistory() {
  const { user, isAuthenticated } = useAuth();

  const { data: meetings, isLoading } = trpc.meetings.getUserMeetings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const pastMeetings = meetings?.filter((m) => m.status === "ended") || [];
  const activeMeetings = meetings?.filter((m) => m.status === "active") || [];
  const scheduledMeetings = meetings?.filter((m) => m.status === "scheduled") || [];



  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meeting History</h1>
          <p className="text-muted-foreground mt-2">View all your past, active, and upcoming meetings</p>
        </div>

        {/* Stats */}
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
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-3xl font-bold text-foreground">{pastMeetings.length}</p>
              </div>
              <Clock className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Now</p>
                <p className="text-3xl font-bold text-foreground">{activeMeetings.length}</p>
              </div>
              <Users className="w-10 h-10 text-accent opacity-50" />
            </div>
          </Card>
        </div>

        {/* Active Meetings */}
        {activeMeetings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Active Meetings</h2>
            <div className="space-y-3">
              {activeMeetings.map((meeting) => (
                <Card key={meeting.id} className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Started {formatMeetingDate(meeting.createdAt)}
                      </p>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Join Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Meetings */}
        {scheduledMeetings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Meetings</h2>
            <div className="space-y-3">
              {scheduledMeetings.map((meeting) => (
                <Card key={meeting.id} className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Scheduled for {meeting.scheduledAt ? formatMeetingDate(meeting.scheduledAt) : "TBD"}
                      </p>
                    </div>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Past Meetings</h2>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id} className="bg-card border border-border p-4 hover:border-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                      {meeting.description && (
                        <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Ended {formatMeetingDate(meeting.updatedAt)} • {formatDuration(meeting.createdAt, meeting.updatedAt)}
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && meetings && meetings.length === 0 && (
          <Card className="bg-card border border-border p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No meetings yet. Create one to get started!</p>
          </Card>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border border-border h-20 animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
