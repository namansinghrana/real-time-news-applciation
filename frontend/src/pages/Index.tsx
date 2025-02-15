import { useState, useEffect } from "react"
import { UserManager } from "@/components/UserManager"
import { SubscriptionManager } from "@/components/SubscriptionManager"
import { NewsFeed } from "@/components/NewsFeed"
import useFetchData from "@/hooks/useFetchData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink } from "lucide-react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";


const queryClient = new QueryClient();

const Index = () => {
  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])


  const handleUserSet = (newUserId: string) => {
    setUserId(newUserId)
    localStorage.setItem("userId", newUserId)
  }

  const { data, error, isLoading } = useFetchData()

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (error)  return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error.message}</div>
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <UserManager onUserSet={handleUserSet} currentUserId={userId} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Your Personalized News Hub</h1>
        <p className="text-muted-foreground text-lg">
          Get instant updates from your chosen news categories, delivered in real-time
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[400px,1fr] items-start">
        <aside className="space-y-6">
        <SubscriptionManager
        userId={userId}
        onSubscriptionChange={() => {
        queryClient.invalidateQueries({ queryKey: ["fetchData"] }); // Refetch the news feed data
        }}
        />

        </aside>
        <main className="space-y-6">
          <NewsFeed userId={userId} />
          <Card>
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
              <CardDescription>Stay updated with the most recent stories</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.map((item: any) => (
                  <li key={item._id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Read more
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Index

