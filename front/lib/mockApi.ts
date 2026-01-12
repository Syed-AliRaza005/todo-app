import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

// Mock API implementation for development
class MockTaskService {
  private tasks: Task[] = [];
  private currentUser: { id: string } | null = null;

  constructor() {
    // Initialize with some sample tasks
    this.tasks = [
      {
        id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task to demonstrate the UI',
        status: 'Pending',
        created_at: new Date().toISOString(),
        user_id: 'mock-user-id',
      },
      {
        id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task',
        status: 'Completed',
        created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
        completed_at: new Date().toISOString(),
        user_id: 'mock-user-id',
      }
    ];
  }

  async getAllTasks(): Promise<Task[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return a copy of the tasks array
    return [...this.tasks];
  }

  async getTaskById(id: string): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: 'Pending',
      created_at: new Date().toISOString(),
      user_id: 'mock-user-id',
    };

    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...taskData,
      id, // Ensure ID doesn't change
    } as Task;

    // If we're updating the status
    if (taskData.status !== undefined) {
      updatedTask.status = taskData.status;
      if (updatedTask.status === 'Completed' && !updatedTask.completed_at) {
        updatedTask.completed_at = new Date().toISOString();
      } else if (updatedTask.status === 'Pending') {
        updatedTask.completed_at = undefined;
      }
    }

    this.tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  }

  async deleteTask(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);

    if (this.tasks.length === initialLength) {
      throw new Error(`Task with id ${id} not found`);
    }
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 250));

    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const task = this.tasks[taskIndex];
    const updatedTask = {
      ...task,
      status: task.status === 'Completed' ? 'Pending' : 'Completed',
    } as Task;

    if (updatedTask.status === 'Completed' && !updatedTask.completed_at) {
      updatedTask.completed_at = new Date().toISOString();
    } else if (updatedTask.status === 'Pending') {
      updatedTask.completed_at = undefined;
    }

    this.tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  }
}

// Export a singleton instance
export const mockTaskService = new MockTaskService();