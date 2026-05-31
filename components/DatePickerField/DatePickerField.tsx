import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;        
  onChange: (date: string) => void;
};

export default function DatePickerField({ value, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <MaterialIcons name="event" size={18} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  icon: {},
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
});
