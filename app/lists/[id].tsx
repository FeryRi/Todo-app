import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { FlatList } from "react-native";

//padre de todos los componentes de tareas, se encarga de manejar la logica de negocio, estados, funciones y renderizar los componentes hijos (TaskItem)

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type Params = {
  id: string;
  title: string;
};

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Setup React Native Environment",
    description: "Install Node.js, Watchman, and Java SDK.",
    completed: false,
  },
  {
    id: "2",
    title: "Bridge Architecture Analysis",
    description: "Read chapter 4 on JS Thread communication.",
    completed: false,
  },
  {
    id: "3",
    title: "Binary Search Tree Implementation",
    description: "Complete the recursive insertion method.",
    completed: true,
  },
  {
    id: "4",
    title: "Native Modules Presentation",
    description: "Prepare slides for Android-JS communication.",
    completed: false,
  },
];

export default function TasksScreen() {
  const { id, title } = useLocalSearchParams<Params>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TASKS), 1000);
    });
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleMenu = (id: string) => {
    console.log("Open menu for task:", id);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setLoading(false);
    };

    load();
  }, []);

  //info que depende de otra info que se va a mostrar, no es necesario un estado,
  // basta con crear una variable y calcular eso en el momento, cada vez que se renderice el componente

  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <>
      <Stack.Screen
        options={{
          title: title,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Box className="flex-1 p-4">
        {/* HEADER CARD */}
        <Box className="bg-blue-600 p-5 rounded-2xl mb-6">
          <Text className="text-white text-xs mb-2">COURSE MODULE</Text>

          <Text className="text-white text-xl font-bold mb-1">{title}</Text>

          <Text className="text-white/80 text-sm mb-4">
            subtitle or description goes here
          </Text>

          <Progress value={percentage}>
            <ProgressFilledTrack />
          </Progress>

          <Text className="text-white text-xs mt-2">
            {percentage}% completed
          </Text>
        </Box>

        {/* SECTION HEADER */}
        <Box className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-semibold text-gray-600">
            ONGOING TASKS
          </Text>

          <Box className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs">
              {tasks.length - completedCount} Items Remaining
            </Text>
          </Box>
        </Box>

        {/* LOADING */}
        {loading && <Spinner size="large" color="grey" />}

        {/* LIST */}
        {!loading && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={handleToggle}
                onMenu={handleMenu}
              />
            )}
          />
        )}
      </Box>
    </>
  );
}
