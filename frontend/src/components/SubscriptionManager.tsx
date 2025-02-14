
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Tech", "Business", "Sports"];

interface SubscriptionManagerProps {
  userId: string;
  onSubscriptionChange: () => void;
}

export const SubscriptionManager = ({
  userId,
  onSubscriptionChange,
}: SubscriptionManagerProps) => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${userId}`);
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    }
  };

  const toggleSubscription = async (category: string) => {
    setLoading(true);
    const isSubscribed = subscriptions.includes(category);
    const endpoint = isSubscribed ? "/api/unsubscribe" : "/api/subscribe";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, category }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
        onSubscriptionChange();
        toast({
          title: isSubscribed ? "Category Removed" : "Category Added",
          description: `You've ${isSubscribed ? "unsubscribed from" : "subscribed to"} ${category} news`,
        });
      }
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
      toast({
        title: "Update Failed",
        description: "Unable to update your category preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <h2 className="text-xl font-semibold">Customize Your Feed</h2>
        <p className="text-sm text-muted-foreground">
          Choose the categories that interest you most
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const isSubscribed = subscriptions.includes(category);
            return (
              <Button
                key={category}
                onClick={() => toggleSubscription(category)}
                variant={isSubscribed ? "default" : "outline"}
                disabled={loading}
                className={`h-auto py-4 flex flex-col items-center justify-center gap-2 min-h-[100px] transition-all duration-300 ${
                  isSubscribed ? "shadow-md" : ""
                }`}
              >
                <span className={`category-chip category-${category.toLowerCase()}`}>
                  {category}
                </span>
                <span className="text-sm">
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
