import { apiClient } from './client';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  getMembers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/auth/members');
    return data.data;
  },
};

