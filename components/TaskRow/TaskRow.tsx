import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Task } from "@/types/Task";

// Helpers 
const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low:    { bg: "#F3F4F6", text: "#6B7280", label: "Low" },
  normal: { bg: "#DBEAFE", text: "#1D4ED8", label: "Normal" },
  high:   { bg: "#FEF3C7", text: "#B45309", label: "High" },
  urgent: { bg: "#FEE2E2", text: "#DC2626", label: "Urgent" },
};

function formatDue(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" });
}


type Props = {
  task: Task;
  accentColor: string;
  onToggleComplete: (task: Task) => Promise<void>;
  onEditPress: (task: Task) => void;
  onDeletePress: (task: Task) => void;
  showActions?: boolean; // false oculta editar/eliminar 
};

// Componente
export default function TaskRow({
  task,
  accentColor,
  onToggleComplete,
  onEditPress,
  onDeletePress,
  showActions = true,
}: Props) {
  const [toggling, setToggling] = useState(false);

  const isDone     = task.status === "completed";
  const priority   = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.normal;
  const dueLabel   = formatDue(task.dueDate);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggleComplete(task);
    } finally {
      setToggling(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* ── Checkbox ── */}
      <Pressable style={styles.checkArea} onPress={handleToggle} disabled={toggling}>
        {toggling ? (
          <ActivityIndicator size={18} color={accentColor} />
        ) : (
          <View style={[
            styles.checkbox,
            isDone && { backgroundColor: accentColor, borderColor: accentColor },
          ]}>
            {isDone && <MaterialIcons name="check" size={13} color="#fff" />}
          </View>
        )}
      </Pressable>

      {/* ── Contenido ── */}
      <View style={styles.content}>
        <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.desc} numberOfLines={2}>{task.description}</Text>
        ) : null}

        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: priority.bg }]}>
            <Text style={[styles.badgeText, { color: priority.text }]}>{priority.label}</Text>
          </View>
          {dueLabel ? (
            <View style={styles.dueBadge}>
              <MaterialIcons name="event" size={11} color="#9CA3AF" />
              <Text style={styles.dueText}>{dueLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Acciones inline (ocultables) ── */}
      {showActions && (
        <View style={styles.actions}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => onEditPress(task)}
            hitSlop={8}
          >
            <MaterialIcons name="edit" size={18} color="#9CA3AF" />
          </Pressable>
          <Pressable
            style={styles.actionBtn}
            onPress={() => onDeletePress(task)}
            hitSlop={8}
          >
            <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
          </Pressable>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkArea: {
    marginRight: 12,
    marginTop: 2,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  desc: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 17,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  dueText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  actions: {
    flexDirection: "column",
    gap: 6,
    marginLeft: 8,
    alignItems: "center",
  },
  actionBtn: {
    padding: 4,
  },
});
