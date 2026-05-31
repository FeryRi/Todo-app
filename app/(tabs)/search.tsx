import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TaskListCard, { ACCENT_COLORS } from "@/components/TaskListCard/TaskListCard";
import TaskRow from "@/components/TaskRow/TaskRow";
import { searchAll, SearchResult } from "@/services/search/searchService";
import { toggleTaskStatus } from "@/services/tasks/taskService";
import { Task, TaskStatus } from "@/types/Task";

const DEBOUNCE_MS = 350;

export default function SearchScreen() {
  const [query, setQuery]     = useState("");
  const [result, setResult]   = useState<SearchResult | null>(null);
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  //  Búsqueda dinámica con debounce 
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResult(null);
      setTasks([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchAll(q);
      setResult(data);
      setTasks(data.tasks);
    } catch (err: any) {
      setError(err?.message ?? "Error al buscar");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(text), DEBOUNCE_MS);
  };

  // Toggle completado - pendiente 

  const handleToggleComplete = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await toggleTaskStatus(task.id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    } catch (err: any) {
      console.error("[Search] toggle error", err?.message);
    }
  };

  // Contadores 
  const listCount = result?.lists.length ?? 0;
  const taskCount = tasks.length;
  const hasQuery  = query.trim().length > 0;
  const hasResult = result !== null;

  // Render 
  return (
    <SafeAreaView style={styles.root}>

      {/* ── App header ── */}
      <View style={styles.appHeader}>
        <View style={styles.brandRow}>
          <MaterialIcons name="menu-book" size={22} color="#3B82F6" />
          <Text style={styles.brandName}>EduTask</Text>
        </View>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={20} color="#6B7280" />
        </View>
      </View>

      {/* ── Barra de búsqueda ── */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks, lists, or notes..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={handleQueryChange}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {loading && (
          <ActivityIndicator size="small" color="#3B82F6" style={styles.searchSpinner} />
        )}
      </View>

      {/* ── Resultados ── */}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Estado vacío inicial */}
        {!hasQuery && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search" size={44} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Find anything</Text>
            <Text style={styles.emptySubtitle}>
              Search your tasks, lists, and notes.
            </Text>
          </View>
        )}

        {/* Sin resultados */}
        {hasQuery && !loading && hasResult && listCount === 0 && taskCount === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={44} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>
              Nothing matched "{query}"
            </Text>
          </View>
        )}

        {/* Error */}
        {error ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={44} color="#EF4444" />
            <Text style={[styles.emptyTitle, { color: "#EF4444" }]}>Error</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
          </View>
        ) : null}

        {/* ── MATCHED LISTS ── */}
        {listCount > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>MATCHED LISTS</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{listCount} found</Text>
              </View>
            </View>
            {result!.lists.map((list) => (
              <TaskListCard key={list.id} item={list} />
            ))}
          </View>
        )}

        {/* ── TASKS & EXERCISES ── */}
        {taskCount > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>TASKS & EXERCISES</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{taskCount} found</Text>
              </View>
            </View>
            {tasks.map((task) => (
              <View key={task.id}>
                {task.listTitle ? (
                  <Text style={styles.taskListLabel}>{task.listTitle}</Text>
                ) : null}
                <TaskRow
                  task={task}
                  accentColor={
                    ACCENT_COLORS[task.listAccentColor ?? ""] ??
                    ACCENT_COLORS.PRIMARY_BLUE
                  }
                  onToggleComplete={handleToggleComplete}
                  onEditPress={() => {}}
                  onDeletePress={() => {}}
                  showActions={false}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  searchSpinner: {
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 64,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#374151",
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  countPill: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
  taskListLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 3,
    marginLeft: 2,
    letterSpacing: 0.3,
  },
});
