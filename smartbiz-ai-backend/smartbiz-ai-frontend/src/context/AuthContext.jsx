import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('smartbiz_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMe();
        setUser(res.data.data.user);
        setBusiness(res.data.data.business);
      } catch (err) {
        localStorage.removeItem('smartbiz_token');
        localStorage.removeItem('smartbiz_user');
        localStorage.removeItem('smartbiz_business');
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const login = useCallback((data) => {
    localStorage.setItem('smartbiz_token', data.token);
    localStorage.setItem('smartbiz_user', JSON.stringify(data.user));
    localStorage.setItem('smartbiz_business', JSON.stringify(data.business));
    setUser(data.user);
    setBusiness(data.business);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('smartbiz_token');
    localStorage.removeItem('smartbiz_user');
    localStorage.removeItem('smartbiz_business');
    setUser(null);
    setBusiness(null);
    window.location.href = '/login';
  }, []);

  const updateBusinessState = useCallback((updatedBusiness) => {
    setBusiness(updatedBusiness);
    localStorage.setItem('smartbiz_business', JSON.stringify(updatedBusiness));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateBusinessState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
