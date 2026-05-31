import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
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

import AddListFab from "@/components/AddListFab/AddListFab";
import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { fetchDashboard } from "@/services/lists/listService";
import { DueTask, TaskList } from "@/types/TaskList";

//Helper: formatea la hora de vencimiento 

function formatDueTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: true });
}

//Sub-componente: fila de tarea "Due Today"

function DueTaskRow({ task }: { task: DueTask }) {
  const bulletColor = task.priority === "urgent" ? "#EF4444" : "#3B82F6";

  const handlePress = () => {
    if (task.listId) {
      router.push({ pathname: "/lists/[id]", params: { id: task.listId } });
    }
  };

  return (
    <Pressable style={styles.dueRow} onPress={handlePress}>
      <View style={[styles.dueBullet, { backgroundColor: bulletColor }]} />
      <Text style={styles.dueTitle} numberOfLines={1}>{task.title}</Text>
      <Text style={styles.dueTime}>{formatDueTime(task.dueDate)}</Text>
    </Pressable>
  );
}

// Pantalla principal

export default function HomeScreen() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [dueTasks, setDueTasks] = useState<DueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Cargando...");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intenta cargar el dashboard hasta MAX_RETRIES antes de mostrar error
  const MAX_RETRIES = 3;

  const loadDashboard = async (attempt = 1) => {
    try {
      setError(null);

      const warmup = setTimeout(
        () => setLoadingMsg(`Despertando el servidor… (intento ${attempt}/${MAX_RETRIES})`),
        5000
      );

      const data = await fetchDashboard();
      clearTimeout(warmup);
      setLoadingMsg("Cargando...");
      setLists(data.lists);
      setDueTasks(data.tasksDueToday);
    } catch (err: any) {
      const status  = err?.response?.status;
      const detail  = err?.response?.data ?? err?.message ?? "sin detalle";
      const apiUrl  = process.env.EXPO_PUBLIC_API_URL ?? "(no definida)";

      // Log completo en consola para diagnóstico
      console.error(`[Dashboard] intento ${attempt}/${MAX_RETRIES}`, { status, detail, apiUrl });

      // Si no hay respuesta HTTP y quedan reintentos, reintenta automáticamente
      if (!err?.response && attempt < MAX_RETRIES) {
        setLoadingMsg(`Sin respuesta. Reintentando en 8s… (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, 8000));
        return loadDashboard(attempt + 1);
      }

      // Error final — muestra el detalle real
      if (status === 401) {
        setError("Sesión inválida. Cierra sesión y vuelve a entrar.");
      } else if (!err?.response) {
        setError(
          `Sin respuesta del servidor después de ${MAX_RETRIES} intentos.\n\n` +
          `URL usada: ${apiUrl}\n\n` +
          "Verifica:\n1. La URL en .env es correcta\n2. El backend está desplegado en Render\n3. Busca errores en el dashboard de Render"
        );
      } else {
        setError(`Error ${status}: ${JSON.stringify(detail)}`);
      }
    }
  };

  // Recarga el dashboard cada vez que la pantalla gana foco.
  // Actualiza el progreso cuando el usuario vuelve del detalle de una lista.
  const mountedRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        setLoading(true);
        await loadDashboard();
        setLoading(false);
      };
      init();
      mountedRef.current = true;
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  // Cuando se crea una lista nueva, la agrega al estado local sin recargar todo
  const handleListCreated = (newList: TaskList) => {
    setLists((prev) => [newList, ...prev]);
  };

  // Componente de encabezado del FlatList 
  // Usar ListHeaderComponent del FlatList evita el problema de VirtualizedList
  // anidado que ocurre si se usa ScrollView por fuera.
  const ListHeader = () => (
    <>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>Your Atelier</Text>
        <Text style={styles.greetingSubtitle}>Focus on what matters today.</Text>
      </View>

      {/* DUE TODAY – solo se muestra si hay tareas */}
      {dueTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DUE TODAY</Text>
          <View style={styles.dueCard}>
            {dueTasks.map((t) => (
              <DueTaskRow key={t.id} task={t} />
            ))}
          </View>
        </View>
      )}

      {/* Separador antes de las listas */}
      {lists.some((l) => l.percentage < 100) && <View style={styles.listsSpacer} />}
    </>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* Header de la app */}
      <View style={styles.appHeader}>
        <View style={styles.brandRow}>
          <MaterialIcons name="menu-book" size={22} color="#3B82F6" />
          <Text style={styles.brandName}>EduTask</Text>
        </View>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={20} color="#6B7280" />
        </View>
      </View>

      {/* Cuerpo principal */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingMsg}>{loadingMsg}</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => loadDashboard()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={lists.filter((l) => l.percentage < 100)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskListCard item={item} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>Aún no tienes listas.{"\n"}Crea una con el botón +</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <AddListFab onListCreated={handleListCreated} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  appHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3B82F6",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  greeting: {
    marginTop: 8,
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  greetingSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 8,
  },
  dueCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dueBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dueTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  dueTime: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  listsSpacer: {
    marginBottom: 4,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    marginBottom: 12,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  loadingMsg: {
    marginTop: 12,
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
