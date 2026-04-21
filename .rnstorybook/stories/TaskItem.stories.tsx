import type { Meta, StoryObj } from "@storybook/react-native";
import { TaskItem } from "../../components/TaskItem/TaskItem"; // ajusta la ruta si es necesario

//tareas de ejemplo
const defaultTask = {
  id: "1",
  title: "Estudiar React Native",
  description: "Leer documentación y hacer ejercicios",
  completed: false,
};

const completedTask = {
  id: "2",
  title: "Comprar ingredientes",
  description: "Leche, huevos, pan",
  completed: true,
};

const longTextTask = {
  id: "3",
  title:
    "Tarea con título muy largo que podría ocupar varias líneas y necesita truncarse",
  description:
    "Descripción igualmente extensa para probar cómo se comporta el componente con textos largos en dispositivos pequeños",
  completed: false,
};

const meta: Meta<typeof TaskItem> = {
  title: "Components/TaskItem",
  component: TaskItem,
  argTypes: {
    onToggle: { action: "toggled" },
    onMenu: { action: "menu pressed" },
  },
};

export default meta;

type Story = StoryObj<typeof TaskItem>;

// Variante 1: Tarea sin completar (default)
export const Default: Story = {
  args: {
    task: defaultTask,
    onToggle: () => {},
    onMenu: () => {},
  },
};

// Variante 2: Tarea completada
export const Completed: Story = {
  args: {
    task: completedTask,
    onToggle: () => {},
    onMenu: () => {},
  },
};

// Variante 3 (opcional): Texto largo
export const LongText: Story = {
  args: {
    task: longTextTask,
    onToggle: () => {},
    onMenu: () => {},
  },
};
