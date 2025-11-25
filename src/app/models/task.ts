export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In progress',
  Completed = 'Completed',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}
