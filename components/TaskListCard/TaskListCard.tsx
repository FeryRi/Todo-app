import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TaskList } from "@/types/TaskList";

// ─── Mapas de datos del backend a valores de UI ───────────────────────────────

// Colores hexadecimales por clave de accentColor del backend
export const ACCENT_COLORS: Record<string, string> = {
  PRIMARY_BLUE: "#3B82F6",
  SLATE: "#4B5563",
  FOREST_GREEN: "#16A34A",
  PURPLE: "#7C3AED",
  RED: "#EF4444",
  ORANGE: "#F59E0B",
  TEAL: "#14B8A6",
  CUSTOM: "#6B7280",
};

// Nombres de ícono de MaterialIcons por clave de icon del backend
export const ICON_MAP: Record<string, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  book: "menu-book",
  flask: "science",
  compass: "architecture",
  globe: "language",
  sigma: "functions",
};

// Colores de los pills de categoría (fondo + texto)
const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CORE_SCIENCE: { bg: "#DBEAFE", text: "#1D4ED8", label: "CORE SCIENCE" },
  HUMANITIES:   { bg: "#DCFCE7", text: "#15803D", label: "HUMANITIES" },
  MATH:         { bg: "#EDE9FE", text: "#6D28D9", label: "MATH" },
  ENGINEERING:  { bg: "#FEF3C7", text: "#B45309", label: "ENGINEERING" },
  GENERAL:      { bg: "#F3F4F6", text: "#374151", label: "GENERAL" },
};

// ─── Helper: tiempo relativo para "Last session" ───────────────────────────────

function formatLastSession(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "Last session just now";
  if (diffH < 24) return `Last session ${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `Last session ${diffD}d ago`;
}

// ─── Componente ───────────────────────────────────────────────────────────────

const TaskListCard: React.FC<{ item: TaskList }> = ({ item }) => {
  const accentHex = ACCENT_COLORS[item.idColor] ?? ACCENT_COLORS.PRIMARY_BLUE;
  const iconName = ICON_MAP[item.idIcon] ?? "menu-book";
  const categoryKey = item.tags[0] ?? "GENERAL";
  const cat = CATEGORY_STYLES[categoryKey] ?? CATEGORY_STYLES.GENERAL;
  const lastSession = formatLastSession(item.lastSessionAt);

  const handlePress = () => {
    router.push({ pathname: "/lists/[id]", params: { id: item.id, title: item.title } });
  };

  // Barra de progreso: el ancho se calcula como porcentaje del contenedor
  const progressWidth = `${Math.min(Math.max(item.percentage, 0), 100)}%`;

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* Borde izquierdo de acento – identifica visualmente la materia */}
      <View style={[styles.accentBar, { backgroundColor: accentHex }]} />

      <View style={styles.body}>
        {/* Fila superior: pill de categoría + icono */}
        <View style={styles.topRow}>
          <View style={[styles.pill, { backgroundColor: cat.bg }]}>
            <Text style={[styles.pillText, { color: cat.text }]}>{cat.label}</Text>
          </View>
          <View style={[styles.iconCircle, { backgroundColor: accentHex + "20" }]}>
            <MaterialIcons name={iconName} size={18} color={accentHex} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

        {/* Subtema del progreso (solo si existe) */}
        {item.topicLabel ? (
          <Text style={styles.topic} numberOfLines={1}>{item.topicLabel}</Text>
        ) : item.subtitle ? (
          <Text style={styles.topic} numberOfLines={1}>{item.subtitle}</Text>
        ) : null}

        {/* Barra de progreso + porcentaje */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressWidth as any, backgroundColor: accentHex }]} />
          </View>
          <Text style={[styles.pct, { color: accentHex }]}>{item.percentage}%</Text>
        </View>

        {/* "Last session" */}
        {lastSession && (
          <View style={styles.sessionRow}>
            <MaterialIcons name="access-time" size={12} color="#9CA3AF" />
            <Text style={styles.sessionText}>{lastSession}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  accentBar: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  topic: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  pct: {
    fontSize: 13,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "right",
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sessionText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});

export default TaskListCard;
