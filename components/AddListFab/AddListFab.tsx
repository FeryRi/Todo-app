import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import CreateListModal from "@/components/CreateListModal/CreateListModal";
import { TaskList } from "@/types/TaskList";

type Props = {
  onListCreated: (newList: TaskList) => void;
};

// Agrupa el botón flotante (+) y el modal de "New List".
// El padre solo necesita pasar onListCreated; el estado del modal
// vive aquí y no contamina la pantalla principal.
export default function AddListFab({ onListCreated }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <CreateListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={(newList) => {
          // Cerrar el modal primero para que React procese ese setState solo.
          // En el siguiente frame ya se aplica la nueva lista en el padre.
          setModalVisible(false);
          setTimeout(() => onListCreated(newList), 0);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
