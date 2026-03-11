import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount — verify token is still valid by fetching user from API
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      const userData = res.data.data.user;
      setUser(userData);
      setToken(savedToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch {
      // Token expired or invalid — clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveAuth = (tokenVal, userData) => {
    localStorage.setItem('token', tokenVal);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const signup = async (formData) => {
    const res = await API.post('/auth/signup', formData);
    const { token: newToken, user: userData } = res.data.data;
    saveAuth(newToken, userData);
    return res.data;
  };

  const signin = async (formData) => {
    const res = await API.post('/auth/signin', formData);
    const { token: newToken, user: userData } = res.data.data;
    saveAuth(newToken, userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const googleLogin = async (credentialResponse) => {
    const res = await API.post('/auth/google', {
      credential: credentialResponse.credential,
    });
    const { token: newToken, user: userData } = res.data.data;
    saveAuth(newToken, userData);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, signin, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
