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

import { ACCENT_COLORS, ICON_MAP } from "@/components/TaskListCard/TaskListCard";
import { updateList, UpdateListPayload } from "@/services/lists/listService";
import { ListDetail } from "@/types/Task";

// ─── Opciones de color e ícono (mismas que CreateListModal) ──────────────────

const COLORS: { key: string; hex: string; label: string }[] = [
  { key: "PRIMARY_BLUE",  hex: ACCENT_COLORS.PRIMARY_BLUE,  label: "Primary Blue" },
  { key: "SLATE",         hex: ACCENT_COLORS.SLATE,         label: "Slate" },
  { key: "FOREST_GREEN",  hex: ACCENT_COLORS.FOREST_GREEN,  label: "Forest Green" },
  { key: "PURPLE",        hex: ACCENT_COLORS.PURPLE,        label: "Purple" },
  { key: "RED",           hex: ACCENT_COLORS.RED,           label: "Red" },
  { key: "ORANGE",        hex: ACCENT_COLORS.ORANGE,        label: "Orange" },
  { key: "TEAL",          hex: ACCENT_COLORS.TEAL,          label: "Teal" },
];

const ICONS: { key: string; materialName: React.ComponentProps<typeof MaterialIcons>["name"]; label: string }[] = [
  { key: "book",    materialName: "menu-book",    label: "Book" },
  { key: "flask",   materialName: "science",      label: "Science" },
  { key: "compass", materialName: "architecture", label: "Compass" },
  { key: "globe",   materialName: "language",     label: "Globe" },
  { key: "sigma",   materialName: "functions",    label: "Math" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  list: ListDetail | null;           // null = modal oculto
  onSaved: (updated: ListDetail) => void;
  onClose: () => void;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EditListModal({ visible, list, onSaved, onClose }: Props) {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("PRIMARY_BLUE");
  const [selectedIcon, setSelectedIcon]   = useState("book");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // Inicializa el formulario con los valores actuales de la lista
  useEffect(() => {
    if (list) {
      setTitle(list.title ?? "");
      setDescription(list.description ?? "");
      setSelectedColor(list.accentColor ?? "PRIMARY_BLUE");
      setSelectedIcon(list.icon ?? "book");
      setError("");
    }
  }, [list]);

  const selectedColorLabel =
    COLORS.find((c) => c.key === selectedColor)?.label.toUpperCase() ?? "";

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!list) return;

    setLoading(true);
    setError("");
    try {
      const payload: UpdateListPayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        accentColor: selectedColor,
        icon: selectedIcon,
      };
      const updated = await updateList(list.id, payload);
      setLoading(false);
      onSaved(updated);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "No se pudo guardar.";
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
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit List</Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Error */}
          {error !== "" && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* TÍTULO */}
          <Text style={styles.fieldLabel}>LIST TITLE *</Text>
          <TextInput
            style={[styles.input, error && !title.trim() ? styles.inputError : null]}
            placeholder="e.g. Computer Science Finals"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={(t) => { setTitle(t); setError(""); }}
            autoCapitalize="sentences"
            returnKeyType="next"
          />

          {/* DESCRIPCIÓN */}
          <Text style={styles.fieldLabel}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes about this collection..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* ACCENT COLOR */}
          <View style={styles.rowHeader}>
            <Text style={styles.fieldLabel}>ACCENT COLOR</Text>
            <View style={[styles.colorLabel, { borderColor: ACCENT_COLORS[selectedColor] }]}>
              <Text style={[styles.colorLabelText, { color: ACCENT_COLORS[selectedColor] }]}>
                {selectedColorLabel}
              </Text>
            </View>
          </View>
          <View style={styles.colorGrid}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c.hex },
                  selectedColor === c.key && styles.swatchSelected,
                ]}
                onPress={() => setSelectedColor(c.key)}
              >
                {selectedColor === c.key && (
                  <MaterialIcons name="check" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* LIBRARY ICON */}
          <Text style={styles.fieldLabel}>LIBRARY ICON</Text>
          <View style={styles.iconRow}>
            {ICONS.map((ic) => {
              const isSelected = selectedIcon === ic.key;
              return (
                <TouchableOpacity
                  key={ic.key}
                  style={[styles.iconBtn, isSelected && styles.iconBtnSelected]}
                  onPress={() => setSelectedIcon(ic.key)}
                >
                  <MaterialIcons
                    name={ic.materialName}
                    size={24}
                    color={isSelected ? ACCENT_COLORS[selectedColor] : "#6B7280"}
                  />
                  {isSelected && (
                    <View
                      style={[
                        styles.iconUnderline,
                        { backgroundColor: ACCENT_COLORS[selectedColor] },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* ── Botón guardar ── */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.submitBtn,
              { backgroundColor: ACCENT_COLORS[selectedColor] },
              loading && styles.btnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Estilos (idénticos a CreateListModal para consistencia) ──────────────────

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: "#fff" },
  header:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  closeBtn:      { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle:   { fontSize: 17, fontWeight: "600", color: "#111827" },
  scroll:        { flex: 1 },
  content:       { padding: 20, paddingBottom: 8 },
  errorBanner:   { backgroundColor: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#EF4444" },
  errorText:     { color: "#DC2626", fontSize: 13 },
  fieldLabel:    { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.8, marginBottom: 8, marginTop: 20 },
  input:         { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827" },
  inputError:    { borderColor: "#EF4444" },
  textArea:      { height: 90, paddingTop: 12 },
  rowHeader:     { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 8 },
  colorLabel:    { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  colorLabelText:{ fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  colorGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorSwatch:   { width: 52, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  swatchSelected:{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  iconRow:       { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  iconBtn:       { width: 56, height: 56, borderRadius: 12, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  iconBtnSelected:{ backgroundColor: "#EFF6FF", borderColor: "transparent" },
  iconUnderline: { position: "absolute", bottom: 6, width: 20, height: 2, borderRadius: 1 },
  footer:        { padding: 20, paddingBottom: 32 },
  submitBtn:     { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnDisabled:   { opacity: 0.6 },
  submitText:    { color: "#fff", fontSize: 16, fontWeight: "700" },
});
