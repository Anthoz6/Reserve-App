import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
