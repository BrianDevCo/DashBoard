import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (username: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // Simulación de autenticación para demo
      if (username === 'admin' && password === 'admin123') {
        const mockUser = {
          id: '1',
          username: 'admin',
          email: 'admin@cgm.com',
          role: 'admin' as const,
          permissions: ['read', 'write', 'admin'],
          name: 'Administrador',
          avatar: null
        };
        
        const mockToken = 'demo-token-123';
        
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        return { success: true };
      } else {
        throw new Error('Credenciales inválidas. Usa: admin / admin123');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    hasPermission,
    isAdmin,
  };
};

