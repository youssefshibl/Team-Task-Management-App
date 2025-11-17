export interface User {
  id: string;
  email: string;
  name: string;
  role: 'team_lead' | 'member';
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  assignedTo: User;
  assignedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskRequest {
  name: string;
  description: string;
  assignedTo: string;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  assignedTo?: string;
}

export interface UpdateTaskStatusRequest {
  status: 'pending' | 'in_progress' | 'done';
}

