import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmModal({
  visible,
  title,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Fondo oscurecido */}
      <Pressable style={styles.backdrop} onPress={onCancel}>
        {/* El Pressable interior evita que el tap en el card cierre el modal */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Ícono */}
          <View style={styles.iconCircle}>
            <MaterialIcons name="delete" size={28} color="#EF4444" />
          </View>

          <Text style={styles.heading}>Delete Task?</Text>
          <Text style={styles.body}>
            Are you sure you want to delete{"\n"}
            <Text style={styles.taskName}>"{title}"</Text>?
            {"\n"}This action cannot be undone.
          </Text>

          <Pressable
            style={[styles.deleteBtn, loading && styles.btnDisabled]}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteBtnText}>Delete Task</Text>
            )}
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  taskName: {
    color: "#374151",
    fontWeight: "600",
  },
  deleteBtn: {
    width: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  btnDisabled: { opacity: 0.6 },
  deleteBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelBtn: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
