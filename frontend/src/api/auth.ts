import { apiClient } from './client';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../types';

// Raw API response types (may have _id instead of id)
interface RawUser {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
  role?: 'team_lead' | 'member';
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

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    // Normalize user in login response
    return {
      ...data,
      user: normalizeUser(data.user),
    };
  },

  getMembers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>('/auth/members');
    return (data.data || []).map(normalizeUser);
  },
};

