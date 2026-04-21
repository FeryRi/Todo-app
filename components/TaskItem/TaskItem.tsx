import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";

//cuando un type se usa en un solo archivo, se puede definir dentro del mismo archivo
// si se va a usar en varios archivos, se recomienda crear un archivo de types.ts y exportarlo desde ahi

//el hijo se encarga de manejar la logica de presentacion, es decir, como se ve el componente, estilos, clases, etc. no tiene logica de negocio ni estados propios, solo recibe props y funciones desde el padre (TasksScreen) para manejar eventos como toggle y menu

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onMenu: (id: string) => void;
};

export function TaskItem({ task, onToggle, onMenu }: Props) {
  return (
    <Box
      className={`flex-row items-center justify-between p-4 rounded-xl mb-3 ${
        task.completed ? "bg-gray-200" : "bg-white border border-gray-300"
      }`}
    >
      {/* LEFT SIDE */}
      <Box className="flex-row items-center flex-1 gap-3">
        {/* Checkbox */}
        <Pressable
          onPress={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-md border items-center justify-center ${
            task.completed ? "bg-green-600 border-green-600" : "border-gray-400"
          }`}
        >
          {task.completed && <Text className="text-white text-xs">✓</Text>}
        </Pressable>

        {/* Text */}
        <Box className="flex-1">
          <Text
            className={`font-semibold ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </Text>

          <Text className="text-sm text-gray-500">{task.description}</Text>
        </Box>
      </Box>

      {/* RIGHT SIDE (3 dots) */}
      <Pressable onPress={() => onMenu(task.id)} className="px-2 py-1">
        <Text className="text-gray-400 text-lg">⋮</Text>
      </Pressable>
    </Box>
  );
}
