import { useAuthContext } from './AuthContext.tsx';

export const useAuth = () => {
  return useAuthContext();
};