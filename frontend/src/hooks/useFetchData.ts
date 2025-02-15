import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the expected news data structure
interface NewsItem {
  _id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
}

const useFetchData = () => {
  return useQuery<NewsItem[]>({
    queryKey: ["fetchData"],
    queryFn: async () => {
      const { data } = await axios.get("https://real-time-news-applciation-production.up.railway.app/api/news");
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetching when switching tabs
  });
};

export default useFetchData;
