import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
}

interface NewsFeedProps {
  userId: string;
}

export const NewsFeed = ({ userId }: NewsFeedProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Connect to the backend WebSocket server
    const newSocket = io("https://real-time-news-applciation-production.up.railway.app", {
      transports: ["websocket"], // Use WebSockets only for real-time efficiency
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      newSocket.emit("register", { userId });
    });

    newSocket.on("newsUpdate", (article: NewsArticle) => {
      setArticles((prev) => [article, ...prev]); // Add new article to the top of the list
      toast({
        title: "📰 New Article",
        description: `📌 ${article.category}: ${article.title}`,
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
      toast({
        title: "⚠️ Connection Error",
        description: "Failed to connect to the news feed.",
        variant: "destructive",
      });
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Disconnecting WebSocket...");
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Latest News</h2>
      <div className="grid gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="news-card fade-in">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`category-chip category-${article.category.toLowerCase()}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{article.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="news-card text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                📭 No articles yet. Subscribe to categories to start receiving updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
