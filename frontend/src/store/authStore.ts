import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  setUser: (user: User | null) => set({ user }),
  setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
}));
