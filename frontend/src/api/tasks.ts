import { apiClient } from './client';
import {
  Task,
  ApiResponse,
  PaginatedResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  User,
} from '../types';

// Raw API response types (may have _id instead of id)
interface RawUser {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
  role?: 'team_lead' | 'member';
}

interface RawTask {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'done';
  assignedTo?: RawUser;
  assignedBy?: RawUser;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to normalize user object (convert _id to id)
const normalizeUser = (user: RawUser | null | undefined): User => {
  if (!user) {
    return { id: '', email: '', name: '', role: 'member' };
  }
  return {
    id: user.id || user._id || '',
    email: user.email || '',
    name: user.name || '',
    role: user.role || 'member',
  };
};

// Helper function to normalize task object (convert _id to id and normalize nested users)
const normalizeTask = (task: RawTask | null | undefined): Task => {
  if (!task) {
    return {
      id: '',
      name: '',
      description: '',
      status: 'pending',
      assignedTo: { id: '', email: '', name: '', role: 'member' },
      assignedBy: { id: '', email: '', name: '', role: 'member' },
      createdAt: '',
      updatedAt: '',
    };
  }
  return {
    id: task.id || task._id || '',
    name: task.name || '',
    description: task.description || '',
    status: task.status || 'pending',
    assignedTo: normalizeUser(task.assignedTo),
    assignedBy: normalizeUser(task.assignedBy),
    createdAt: task.createdAt || '',
    updatedAt: task.updatedAt || '',
  };
};

export const tasksApi = {
  // Team Lead endpoints
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const { data } = await apiClient.post<ApiResponse<Task>>('/tasks/create', task);
    return normalizeTask(data.data);
  },

  getAllTasks: async (
    page: number = 1,
    limit: number = 30,
    filters?: { status?: string; assignedTo?: string },
  ): Promise<{
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.assignedTo) {
      params.append('assignedTo', filters.assignedTo);
    }
    const { data } = await apiClient.get<PaginatedResponse<Task>>(
      `/tasks/get-all?${params.toString()}`
    );
    return {
      tasks: (data.data || []).map(normalizeTask),
      pagination: data.pagination,
    };
  },

  getTaskById: async (id: string): Promise<Task> => {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return normalizeTask(data.data);
  },

  updateTask: async (id: string, task: UpdateTaskRequest): Promise<Task> => {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return normalizeTask(data.data);
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // Member endpoints
  updateTaskStatus: async (id: string, status: UpdateTaskStatusRequest): Promise<Task> => {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}/status`, status);
    return normalizeTask(data.data);
  },

  getAssignedTasks: async (
    page: number = 1,
    limit: number = 30,
    filters?: { status?: string; assignedBy?: string },
  ): Promise<{
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.assignedBy) {
      params.append('assignedBy', filters.assignedBy);
    }
    const { data } = await apiClient.get<PaginatedResponse<Task>>(
      `/tasks/assigned-to-me?${params.toString()}`
    );
    return {
      tasks: (data.data || []).map(normalizeTask),
      pagination: data.pagination,
    };
  },

  // Statistics endpoint
  getStatistics: async (): Promise<{
    pending: number;
    in_progress: number;
    done: number;
    total: number;
  }> => {
    const { data } = await apiClient.get<ApiResponse<{
      pending: number;
      in_progress: number;
      done: number;
      total: number;
    }>>('/tasks/statistics');
    return data.data;
  },
};

