import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTaskModal from "@/components/AddTaskModal/AddTaskModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal/DeleteConfirmModal";
import EditListModal from "@/components/EditListModal/EditListModal";
import EditTaskModal from "@/components/EditTaskModal/EditTaskModal";
import TaskRow from "@/components/TaskRow/TaskRow";
import { ACCENT_COLORS } from "@/components/TaskListCard/TaskListCard";
import { deleteList, fetchListDetail } from "@/services/lists/listService";
import { deleteTask, toggleTaskStatus } from "@/services/tasks/taskService";
import { ListDetail, Task, TaskStatus } from "@/types/Task";

// Pantalla principal
export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [list, setList]           = useState<ListDetail | null>(null);
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Estado de modales — tareas
  const [addModalOpen, setAddModalOpen]       = useState(false);
  const [taskToEdit, setTaskToEdit]           = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete]       = useState<Task | null>(null);
  const [deleting, setDeleting]               = useState(false);

  // Estado modal — eliminar lista completa
  const [deleteListOpen, setDeleteListOpen]   = useState(false);
  const [deletingList, setDeletingList]       = useState(false);

  // Estado modal — editar lista
  const [editListOpen, setEditListOpen]       = useState(false);

  // Carga de datos
  const loadDetail = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchListDetail(id);
      setList(data);
      setTasks(data.tasks ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Error al cargar la lista");
    }
  }, [id]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadDetail();
      setLoading(false);
    };
    init();
  }, [loadDetail]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDetail();
    setRefreshing(false);
  };

  //  Cálculo de progreso local 

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount     = tasks.length;
  const percentage     = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  // Solo muestra tareas NO completadas
  const pendingTasks   = tasks.filter((t) => t.status !== "completed");

  //  Handlers 
  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await toggleTaskStatus(task.id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch (err: any) {
      console.error("[toggle] error", err?.response?.status, err?.response?.data ?? err?.message);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setAddModalOpen(false);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskSaved = (updated: Task) => {
    setTaskToEdit(null);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleListSaved = (updated: ListDetail) => {
    setEditListOpen(false);
    // Preserva las tareas ya cargadas — el backend no las devuelve en el PUT
    setList((prev) => prev ? { ...updated, tasks: prev.tasks } : updated);
  };

  const handleDeleteList = async () => {
    setDeletingList(true);
    try {
      await deleteList(id);
      setDeleteListOpen(false);
      router.replace("/(tabs)");   // regresar al dashboard después de eliminar
    } catch (err: any) {
      console.error("[deleteList]", err?.response?.status, err?.message);
      setDeletingList(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);     // cerrar el modal automáticamente
    } catch (err: any) {
      setDeleting(false);
      setError(err?.response?.data?.message ?? err?.message ?? "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  //  Color del acento de la lista
  const accentHex = ACCENT_COLORS[list?.accentColor ?? ""] ?? ACCENT_COLORS.PRIMARY_BLUE;

  // Header del FlatList 
  const ListHeader = () => (
    <>
      {/* Banner de la lista */}
      <View style={[styles.banner, { backgroundColor: accentHex }]}>
        <Text style={styles.bannerEyebrow}>COURSE MODULE</Text>
        <Text style={styles.bannerTitle}>{list?.title}</Text>
        {list?.description ? (
          <Text style={styles.bannerDesc}>{list.description}</Text>
        ) : null}
        {/* Barra de progreso */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{percentage}% completed</Text>
      </View>

      {/* Encabezado de sección */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ONGOING TASKS</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pendingTasks.length} Items Remaining</Text>
        </View>
      </View>

      {/* Error en línea */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Vacío */}
      {!loading && pendingTasks.length === 0 && (
        <View style={styles.empty}>
          <MaterialIcons name="check-circle-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>¡Todo listo! Agrega una tarea con el botón +</Text>
        </View>
      )}
    </>
  );

  //  Render 
  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <Stack.Screen options={{ headerShown: true, title: "", headerBackButtonDisplayMode: "minimal" }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ACCENT_COLORS.PRIMARY_BLUE} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      {/* El header de navegación nativo muestra el título y back */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: list?.title ?? "Detalle",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: { backgroundColor: accentHex },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Pressable onPress={() => setEditListOpen(true)} style={{ padding: 6 }}>
                <MaterialIcons name="edit" size={22} color="#fff" />
              </Pressable>
              <Pressable onPress={() => setDeleteListOpen(true)} style={{ marginRight: 4, padding: 6 }}>
                <MaterialIcons name="delete-outline" size={22} color="#fff" />
              </Pressable>
            </View>
          ),
        }}
      />

      <FlatList
        data={pendingTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            accentColor={accentHex}
            onToggleComplete={handleToggleComplete}
            onEditPress={(t) => setTaskToEdit(t)}
            onDeletePress={(t) => setTaskToDelete(t)}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Agregar tarea */}
      <Pressable style={[styles.fab, { backgroundColor: accentHex }]} onPress={() => setAddModalOpen(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </Pressable>

      {/*Modales*/}
      <AddTaskModal
        visible={addModalOpen}
        listId={id}
        accentColor={accentHex}
        onCreated={handleTaskCreated}
        onClose={() => setAddModalOpen(false)}
      />

      <EditTaskModal
        visible={taskToEdit !== null}
        task={taskToEdit}
        accentColor={accentHex}
        onSaved={handleTaskSaved}
        onClose={() => setTaskToEdit(null)}
      />

      <DeleteConfirmModal
        visible={taskToDelete !== null}
        title={taskToDelete?.title ?? ""}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Eliminar lista completa */}
      <DeleteConfirmModal
        visible={deleteListOpen}
        title={list?.title ?? "este módulo"}
        loading={deletingList}
        onConfirm={handleDeleteList}
        onCancel={() => setDeleteListOpen(false)}
      />

      {/* Editar lista */}
      <EditListModal
        visible={editListOpen}
        list={list}
        onSaved={handleListSaved}
        onClose={() => setEditListOpen(false)}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  banner: {
    borderRadius: 18,
    padding: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  bannerEyebrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  bannerDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  progressLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 12,
  },
  empty: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
