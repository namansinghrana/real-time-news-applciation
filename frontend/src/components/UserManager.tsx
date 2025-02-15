import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserManagerProps {
  onUserSet: (userId: string) => void;
  currentUserId: string | null;
}

export const UserManager = ({ onUserSet, currentUserId }: UserManagerProps) => {
  const [userId, setUserId] = useState(currentUserId || "");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userId.trim()) {
      setLoading(true);
      try {
        // Send request to backend
        const response = await axios.post("https://real-time-news-applciation-production.up.railway.app/api/user", { userId });

        if (response.status === 200) {
          onUserSet(userId.trim());
          localStorage.setItem("userId", userId.trim()); // Store in local storage

          toast({
            title: "Welcome to Your News Hub!",
            description: `Signed in successfully as ${userId}`,
          });
        }
      } catch (error) {
        console.error("Error authenticating user:", error);
        toast({
          title: "Error",
          description: "Failed to sign in. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome Back!</h2>
        <p className="text-sm text-muted-foreground">
          Sign in with your ID to access your personalized news feed
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type your user ID here"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Start Reading"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
