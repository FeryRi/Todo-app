import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateTask } from "@/services/tasks/taskService";
import { Task, TaskPriority } from "@/types/Task";
import DatePickerField from "@/components/DatePickerField/DatePickerField";


const PRIORITIES: { key: TaskPriority; label: string; color: string }[] = [
  { key: "low",    label: "Low",    color: "#6B7280" },
  { key: "normal", label: "Normal", color: "#3B82F6" },
  { key: "high",   label: "High",   color: "#F59E0B" },
  { key: "urgent", label: "Urgent", color: "#EF4444" },
];


type Props = {
  visible: boolean;
  task: Task | null;       // null = modal oculto
  accentColor: string;
  onSaved: (updated: Task) => void;
  onClose: () => void;
};

// Componente 
export default function EditTaskModal({ visible, task, accentColor, onSaved, onClose }: Props) {
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]     = useState<TaskPriority>("normal");
  const [dueDate, setDueDate]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // Cuando la tarea a editar cambia, inicializa el formulario con sus datos
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority ?? "normal");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : ""); // YYYY-MM-DD
      setError("");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    if (!task) return;
    setLoading(true);
    setError("");
    try {
      const updated = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate + "T12:00:00").toISOString() : null,
      });
      setLoading(false); // resetear antes de cerrar para reapertura limpia
      onSaved(updated);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data ?? err?.message ?? "Error al guardar";
      setError(String(msg));
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Task</Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {error !== "" && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Título */}
          <Text style={styles.label}>TASK TITLE *</Text>
          <TextInput
            style={[styles.input, error && !title.trim() ? styles.inputError : null]}
            placeholder="e.g. Read chapter 5"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={(t) => { setTitle(t); setError(""); }}
            autoCapitalize="sentences"
          />

          {/* Descripción */}
          <Text style={styles.label}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Prioridad */}
          <Text style={styles.label}>PRIORITY</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.priorityBtn, priority === p.key && { backgroundColor: p.color, borderColor: p.color }]}
                onPress={() => setPriority(p.key)}
              >
                <Text style={[styles.priorityText, priority === p.key && { color: "#fff" }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fecha */}
          <Text style={styles.label}>DUE DATE</Text>
          <DatePickerField value={dueDate} onChange={setDueDate} />
        </ScrollView>

        {/* Botón guardar */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.submitBtn, { backgroundColor: accentColor }, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Save Changes</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}


const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: "#fff" },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  closeBtn:      { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle:   { fontSize: 17, fontWeight: "600", color: "#111827" },
  scroll:        { flex: 1 },
  content:       { padding: 20, paddingBottom: 8 },
  errorBanner:   { backgroundColor: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#EF4444" },
  errorText:     { color: "#DC2626", fontSize: 13 },
  label:         { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.8, marginBottom: 8, marginTop: 20 },
  input:         { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827" },
  inputError:    { borderColor: "#EF4444" },
  textArea:      { height: 90, paddingTop: 12 },
  priorityRow:   { flexDirection: "row", gap: 8 },
  priorityBtn:   { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "#E5E7EB" },
  priorityText:  { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  footer:        { padding: 20, paddingBottom: 32 },
  submitBtn:     { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnDisabled:   { opacity: 0.6 },
  submitText:    { color: "#fff", fontSize: 16, fontWeight: "700" },
});
