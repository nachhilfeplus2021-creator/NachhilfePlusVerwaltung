import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { getInitialData } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('nachhilfe_auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    const stored = localStorage.getItem('nachhilfe_data');
    const data = stored ? JSON.parse(stored) : getInitialData();
    const users: User[] = data.users || [];
    const user = users.find(u => u.email === email && u.passwordHash === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('nachhilfe_auth', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nachhilfe_auth');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
