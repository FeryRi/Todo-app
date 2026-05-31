export type TaskStatus   = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type Task = {
  id: string;
  listId?: string;
  listTitle?: string;        
  listAccentColor?: string;  
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  pinned?: boolean;
  tags?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
};

export type ListDetail = {
  id: string;
  title: string;
  description?: string;
  accentColor: string;
  icon: string;
  category?: string | null;
  progressPct?: number;
  topicLabel?: string;
  lastSessionAt?: string | null;
  tasks: Task[];
};
