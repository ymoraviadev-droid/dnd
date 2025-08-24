export type TaskResult = {
  taskId: string;
  success: boolean;
  response?: string;
  error?: string;
  metadata?: Record<string, any>;
}
