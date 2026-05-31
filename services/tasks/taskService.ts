import api from "../api";
import { Task, TaskPriority, TaskStatus } from "@/types/Task";

export type CreateTaskPayload = {
  title: string;
  description?: string;
  listId?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
};

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

// Alterna entre "completed" y "pending".
export async function toggleTaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/status`, { status: newStatus });
  return data;
}
