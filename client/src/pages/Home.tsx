import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Video, MessageSquare, Users, Lock, Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = () => {
    const loginUrl = `${window.location.origin}/api/oauth/login`;
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Video className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Devano Meeting</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Team meetings made simple and fast
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with your team instantly. Crystal-clear video, real-time chat, and seamless collaboration—all in one place.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleLogin}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Sign In with Google
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLogin}
              >
                Sign In with Microsoft
              </Button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <Video className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">HD Video</h3>
              <p className="text-sm text-muted-foreground">Crystal-clear video conferencing for your entire team</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <MessageSquare className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Instant Chat</h3>
              <p className="text-sm text-muted-foreground">Real-time messaging with zero delay</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Users className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Team Directory</h3>
              <p className="text-sm text-muted-foreground">Manage and invite team members easily</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Lock className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security for your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Optimized for speed with instant message delivery and low-latency video</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">Schedule meetings, invite teammates, and track meeting history</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Video className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Full Control</h3>
                <p className="text-muted-foreground">Toggle camera and microphone, see participant status in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg text-muted-foreground mb-8">Join thousands of teams using Devano Meeting for seamless collaboration</p>
        <Button
          size="lg"
          onClick={handleLogin}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Sign In Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2026 Devano Meeting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
