import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  register: async (email: string, firstName: string, lastName: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      firstName,
      lastName,
      password
    });
    return response.data.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    const { user, accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, accessToken };
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  }
};
