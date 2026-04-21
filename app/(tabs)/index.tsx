import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { TaskList } from "@/types/TaskList";

const MOCK_TASK_LISTS: TaskList[] = [
  {
    id: "1",
    title: "Computer Science",
    subtitle: "Algorithms and data structures",
    percentage: 60,
    tags: ["school", "important"],
    idColor: "bg-blue-500",
    idIcon: "code",
  },
  {
    id: "2",
    title: "History",
    subtitle: "World War II notes",
    percentage: 30,
    tags: ["reading"],
    idColor: "bg-green-500",
    idIcon: "menu-book",
  },
  {
    id: "3",
    title: "Math",
    subtitle: "Calculus exercises",
    percentage: 90,
    tags: ["practice", "exam"],
    idColor: "bg-purple-500",
    idIcon: "functions",
  },
];

export default function HomeScreen() {
  //todo lo que venga desde DB se guarda en un UseState, asi como estados de loading, refreshing y error
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskLists = async (): Promise<TaskList[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldFail = Math.random() < 0.3;

        if (shouldFail) {
          reject(new Error("Failed to fetch lists"));
        } else {
          resolve(MOCK_TASK_LISTS);
        }
      }, 1000);
    });
  };

  const loadLists = async (fromRefresh: boolean = false) => {
    try {
      setError(null);
      if (fromRefresh) {
        setLoading(true);
      }
      const data = await fetchTaskLists();
      setLists(data);
      if (fromRefresh) {
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong");
      setLists([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadLists();
      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //siempre dejar los []

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLists();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-4">
        <Text className="text-2xl mb-4">Task Lists</Text>

        {/* Loading */}
        {loading && (
          <Box className="mt-4">
            <Spinner size="large" color="grey" />
          </Box>
        )}

        {/* Error */}
        {!loading && error && (
          <>
            <Text className="text-red-500 mb-2">{error}</Text>
            <Pressable onPress={() => loadLists(true)}>
              <Text className="text-blue-500 underline">Retry</Text>
            </Pressable>
          </>
        )}

        {/* Empty */}
        {!loading && !error && lists.length === 0 && (
          <Text>No tasks available</Text>
        )}

        {/* List */}
        {!loading && !error && (
          <FlatList //  Renderisa solo lo que se ve en pantalla, se recomienda usarlo cuando hay muchisima info (20+ items)
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskListCard item={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </Box>

      {/* acceder a storybook desde el home, solo en modo desarrollo */}
      {__DEV__ && (
        <View className="absolute bottom-4 left-0 right-0 items-center">
          <Link href="/storybook" className="text-blue-500 underline text-base">
            Open Storybook
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
}
