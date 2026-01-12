import { getCurrentUser } from './auth';
import { mockTaskService } from './mockApi';

// Helper function to get API base URL with proper validation
function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is required');
  }
  return baseUrl;
}

// Define TypeScript interfaces for our data models
// These match your Python FastAPI backend schema
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Completed';  // Your backend uses status field instead of completed
  created_at: string;
  completed_at?: string;
  user_id: string;
  updated_at?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'Pending' | 'Completed';
}

// Use mock API if explicitly set to 'true', otherwise use real API
const USE_MOCK_API = process.env.USE_MOCK_API === 'true';

// API functions for tasks
export const taskApi = {
  // Get all tasks for the current user
  async getAllTasks(): Promise<Task[]> {
    if (USE_MOCK_API) {
      return mockTaskService.getAllTasks();
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to sign in if unauthorized
            if (typeof window !== 'undefined') {
              window.location.href = '/(auth)/signin';
            }
          }
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // The backend returns a TaskListResponse object, so we extract the tasks array
        return result.tasks || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    }
  },

  // Get a specific task by ID
  async getTaskById(id: string): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.getTaskById(id);
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${id}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Error fetching task ${id}:`, error);
        throw error;
      }
    }
  },

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.createTask(taskData);
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
          method: 'POST',
          headers,
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    }
  },

  // Update a task
  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.updateTask(id, taskData);
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Error updating task ${id}:`, error);
        throw error;
      }
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockTaskService.deleteTask(id);
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${id}`, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error deleting task ${id}:`, error);
        throw error;
      }
    }
  },

  // Toggle task completion status
  async toggleTaskCompletion(id: string): Promise<Task> {
    if (USE_MOCK_API) {
      return mockTaskService.toggleTaskCompletion(id);
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      // Note: Your backend has a specific endpoint for marking tasks as complete
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage (stored by your auth system)
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the current user ID from the stored user data
        let userId;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user_data');
          if (userData) {
            userId = JSON.parse(userData).id;
          }
        }

        if (!userId) {
          throw new Error('No user ID found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${id}/complete`, {
          method: 'POST',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to toggle task completion: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`Error toggling task completion ${id}:`, error);
        throw error;
      }
    }
  },
};

// API functions for authentication (connecting to your Python FastAPI backend)
export const authApi = {
  async signUp(userData: { email: string; password: string; name: string }) {
    if (USE_MOCK_API) {
      // For mock, we'll just return success
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, user: { id: 'mock-user-id', ...userData } };
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Failed to sign up: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error signing up:', error);
        throw error;
      }
    }
  },

  async signIn(credentials: { email: string; password: string }) {
    if (USE_MOCK_API) {
      // For mock, we'll just return success
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        user: { id: 'mock-user-id', email: credentials.email, name: credentials.email.split('@')[0] },
        access_token: 'mock-token'
      };
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          throw new Error(`Failed to sign in: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      }
    }
  },

  async signOut() {
    if (USE_MOCK_API) {
      // For mock, we'll just return success
      await new Promise(resolve => setTimeout(resolve, 300));
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      return { success: true };
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to sign out: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  },

  // Get user info from the backend
  async getUserInfo() {
    if (USE_MOCK_API) {
      // For mock, we'll return mock user info
      return {
        id: 'mock-user-id',
        email: 'mock@example.com',
        name: 'Mock User'
      };
    } else {
      // Real API implementation connecting to your Python FastAPI backend
      const API_BASE_URL = getApiBaseUrl();
      try {
        // Get the JWT token from localStorage
        let token;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to get user info: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
      }
    }
  },
};