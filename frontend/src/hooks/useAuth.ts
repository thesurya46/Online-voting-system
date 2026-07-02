import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { isLoading: isCheckingAuth } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    logout
  };
};
