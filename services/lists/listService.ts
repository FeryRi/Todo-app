import api from "../api";
import { DueTask, TaskList } from "@/types/TaskList";

// Tipos que reflejan exactamente la respuesta del backend 

type EduListResponse = {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  icon: string;
  category: string | null;
  archived: boolean;
  progressPct: number;
  topicLabel?: string;
  lastSessionAt?: string | null;
};

type DueTaskResponse = {
  id: string;
  title: string;
  dueDate: string;
  listId?: string;
  listAccentColor?: string;
  priority?: string;
};

type DashboardResponse = {
  tasksDueToday: DueTaskResponse[];
  lists: EduListResponse[];
};

export type CreateListPayload = {
  title: string;
  description?: string;
  accentColor?: string;
  icon?: string;
  category?: string;
};

export type UpdateListPayload = {
  title?: string;
  description?: string;
  accentColor?: string;
  icon?: string;
  category?: string;
};

//  Mappers: backend - UI

function mapToTaskList(item: EduListResponse): TaskList {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.description ?? "",
    percentage: item.progressPct,
    tags: item.category ? [item.category] : [],
    idColor: item.accentColor ?? "PRIMARY_BLUE",
    idIcon: item.icon ?? "book",
    topicLabel: item.topicLabel,
    lastSessionAt: item.lastSessionAt,
  };
}

function mapToDueTask(item: DueTaskResponse): DueTask {
  return {
    id: item.id,
    title: item.title,
    dueDate: item.dueDate,
    listId: item.listId,
    listAccentColor: item.listAccentColor,
    priority: item.priority,
  };
}

// Funciones de acceso a la API
// GET /dashboard – devuelve tareas de hoy + listas con progreso 
// (endpoint principal)
export async function fetchDashboard(): Promise<{
  tasksDueToday: DueTask[];
  lists: TaskList[];
}> {
  const response = await api.get<DashboardResponse>("/dashboard");
  return {
    tasksDueToday: response.data.tasksDueToday.map(mapToDueTask),
    lists: response.data.lists.map(mapToTaskList),
  };
}

// GET /lists 
export async function fetchLists(): Promise<TaskList[]> {
  const response = await api.get<EduListResponse[]>("/lists");
  return response.data.map(mapToTaskList);
}

// POST /lists – crea una nueva lista y retorna la creada 
export async function createList(payload: CreateListPayload): Promise<TaskList> {
  const response = await api.post<EduListResponse>("/lists", payload);
  return mapToTaskList(response.data);
}

// GET /lists/{id} – detalle de una lista con su array de tareas
export async function fetchListDetail(id: string): Promise<import("@/types/Task").ListDetail> {
  const { data } = await api.get(`/lists/${id}`);
  return data;
}

// PUT /lists/{id} – actualiza los campos de una lista (título, color, icono…)
export async function updateList(
  id: string,
  payload: UpdateListPayload
): Promise<import("@/types/Task").ListDetail> {
  const { data } = await api.put(`/lists/${id}`, payload);
  return data;
}

// DELETE /lists/{id} – elimina la lista y todas sus tareas
export async function deleteList(id: string): Promise<void> {
  await api.delete(`/lists/${id}`);
}
