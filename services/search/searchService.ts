import api from "../api";
import { Task } from "@/types/Task";
import { TaskList } from "@/types/TaskList";

type EduListResult = {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  icon: string;
  category: string | null;
  progressPct: number;
  topicLabel?: string;
  lastSessionAt?: string | null;
};

type SearchApiResponse = {
  lists: EduListResult[];
  tasks: Task[];
};

export type SearchResult = {
  lists: TaskList[];
  tasks: Task[];
};


function mapList(item: EduListResult): TaskList {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.description ?? "",
    percentage: item.progressPct ?? 0,
    tags: item.category ? [item.category] : [],
    idColor: item.accentColor ?? "PRIMARY_BLUE",
    idIcon: item.icon ?? "book",
    topicLabel: item.topicLabel,
    lastSessionAt: item.lastSessionAt,
  };
}

//GET /search?q=query 
export async function searchAll(query: string): Promise<SearchResult> {
  const { data } = await api.get<SearchApiResponse>("/search", {
    params: { q: query },
  });
  return {
    lists: data.lists.map(mapList),
    tasks: data.tasks,
  };
}
