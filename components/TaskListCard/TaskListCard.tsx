import { TaskList } from "@/types/TaskList";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { Box } from "../ui/box";
import { Progress } from "../ui/progress";

export const a = 1;

const TaskListCard: React.FC<{ item: TaskList }> = ({ item }) => {
  //estados, useState, variables, constantes

  //funciones
  const handlePress = () => {
    router.push({
      pathname: "/lists/[id]",
      params: {
        id: item.id,
        title: item.title,
      },
    }); // Navega a la pantalla de detalles de la lista de tareas
  };

  //useEffects
  //maneja todo el estado de vida de un componente, desde la carga inicial, actualizaciones y limpieza
  //el manejo de APIs se hace desde aqui

  //render
  return (
    <Pressable
      className="p-4 border-gray-300 rounded-xl mb-3"
      onPress={handlePress}
    >
      {/* Titulo */}
      <Text className="text-lg font-semibold">{item.title}</Text>

      {/* Subtitulo */}
      <Text className="text-sm ttext-gray-500 mb-2">{item.subtitle}</Text>

      <Box className="mb-3">
        <Progress value={item.percentage} size="md" />

        <Progress>
          <Text className="text-xs text-gray-500 st-1">
            {item.percentage}% completed
          </Text>
        </Progress>
      </Box>
    </Pressable>
  );
};
export default TaskListCard;
