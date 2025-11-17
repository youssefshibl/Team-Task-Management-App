import { apiClient } from './client';
import {
  Task,
  ApiResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from '../types';

export const tasksApi = {
  // Team Lead endpoints
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const { data } = await apiClient.post<ApiResponse<Task>>('/tasks/create', task);
    return data.data;
  },

  getAllTasks: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>('/tasks/get-all');
    return data.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data.data;
  },

  updateTask: async (id: string, task: UpdateTaskRequest): Promise<Task> => {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return data.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // Member endpoints
  updateTaskStatus: async (id: string, status: UpdateTaskStatusRequest): Promise<Task> => {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}/status`, status);
    return data.data;
  },

  getAssignedTasks: async (): Promise<Task[]> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>('/tasks/assigned-to-me');
    return data.data;
  },
};

