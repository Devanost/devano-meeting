import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { Users, Plus, Mail, Phone } from "lucide-react";

interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: "owner" | "member" | "admin";
  joinedAt: Date;
  createdAt: Date;
  userName?: string;
}

export default function TeamDirectory() {
  const { user, isAuthenticated } = useAuth();

  const { data: teamMembers, isLoading } = trpc.teamMembers.list.useQuery(
    { teamId: user?.id || 0 },
    {
      enabled: isAuthenticated && !!user?.id,
    }
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Directory</h1>
            <p className="text-muted-foreground mt-2">Manage and invite team members</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
            <Plus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        {/* Team Members Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card border border-border h-48 animate-pulse" />
            ))}
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member: TeamMember) => (
              <Card
                key={member.id}
                className="bg-card border border-border p-6 hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {(member.userName || "User").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    member.role === "owner"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : member.role === "admin"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}>
                    {member.role}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{member.userName || "Team Member"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    disabled
                  >
                    <Mail className="w-4 h-4" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    disabled
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border border-border p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No team members yet. Invite your first team member!</p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              <Plus className="w-4 h-4" />
              Invite Member
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
