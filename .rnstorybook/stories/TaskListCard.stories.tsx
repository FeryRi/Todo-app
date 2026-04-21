import type { Meta, StoryObj } from "@storybook/react-native";
import TaskListCard from "../../components/TaskListCard/TaskListCard";
import { TaskList } from "../../types/TaskList";

// ejemplos de TaskList
const defaultList: TaskList = {
  id: "1",
  title: "Computer Science",
  subtitle: "Algorithms and data structures",
  percentage: 60,
  tags: ["school", "important"],
  idColor: "bg-blue-500",
  idIcon: "code",
};

const completedList: TaskList = {
  id: "2",
  title: "Math",
  subtitle: "Calculus exercises - Completed",
  percentage: 100,
  tags: ["exam"],
  idColor: "bg-green-500",
  idIcon: "functions",
};

const emptyList: TaskList = {
  id: "3",
  title: "History",
  subtitle: "",
  percentage: 0,
  tags: [],
  idColor: "bg-gray-500",
  idIcon: "menu-book",
};

const meta: Meta<typeof TaskListCard> = {
  title: "Components/TaskListCard",
  component: TaskListCard,
  decorators: [(Story) => <Story />],
};

export default meta;

type Story = StoryObj<typeof TaskListCard>;

// Variante 1: Lista normal (60%)
export const Default: Story = {
  args: {
    item: defaultList,
  },
};

// Variante 2: Completada (100%)
export const Completed: Story = {
  args: {
    item: completedList,
  },
};

// Variante 3: Vacía (sin subtítulo, 0%)
export const Empty: Story = {
  args: {
    item: emptyList,
  },
};
