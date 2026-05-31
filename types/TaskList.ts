export type TaskList = {
  id: string;
  title: string;
  subtitle: string;      
  percentage: number;    
  tags: string[];        
  idColor: string;       
  idIcon: string;        
  topicLabel?: string;   
  lastSessionAt?: string | null;
};

// Tarea con vencimiento hoy (sección DUE TODAY del dashboard)
export type DueTask = {
  id: string;
  title: string;
  dueDate: string;           
  listId?: string;
  listAccentColor?: string;
  priority?: string;
};
