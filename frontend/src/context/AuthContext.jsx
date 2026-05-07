import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin } from '../api/authService';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, isTokenExpired } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();
    if (storedToken && !isTokenExpired(storedToken)) {
      setTokenState(storedToken);
      setUserState(storedUser);
    } else if (storedToken) {
      removeToken();
      removeUser();
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const response = await apiLogin(username, password);
    const { token: jwt } = response.data;
    setToken(jwt);
    const userData = { username };
    setUser(userData);
    setTokenState(jwt);
    setUserState(userData);
    return jwt;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
