import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  value: string;        // YYYY-MM-DD
  onChange: (date: string) => void;
};

function formatDisplay(ymd: string): string {
  if (!ymd) return "Selecciona una fecha";
  const d = new Date(ymd + "T12:00:00");
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

export default function DatePickerField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    // showPicker() abre el calendar nativo del browser desde un gesto de usuario
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.click(); // fallback para Safari antiguo
    }
  };

  return (
    // El div envoltorio captura el click y lo reenvía al input oculto
    <div
      onClick={openPicker}
      style={{
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 12,
        paddingBottom: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        position: "relative",
        userSelect: "none",
      }}
    >
      <MaterialIcons name="event" size={18} color="#6B7280" />
      <span style={{ flex: 1, fontSize: 15, color: value ? "#111827" : "#9CA3AF" }}>
        {formatDisplay(value)}
      </span>
      <MaterialIcons name="arrow-drop-down" size={18} color="#9CA3AF" />

      {/* Input real — invisible pero en el DOM para que showPicker funcione */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          border: "none",
          padding: 0,
        }}
        tabIndex={-1}
      />
    </div>
  );
}

// Estilos vacíos — este componente usa CSS nativo de web (no StyleSheet)
const styles = StyleSheet.create({});
