import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminLogin, adminSignup, adminGoogleLogin, getAdminProfile } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getAdminProfile();
      const adminData = res.data.data.admin;
      setAdmin(adminData);
      setToken(savedToken);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    } catch {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdmin(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const saveAuth = (tokenVal, adminData) => {
    localStorage.setItem('adminToken', tokenVal);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
    setToken(tokenVal);
    setAdmin(adminData);
  };

  const signin = async (formData) => {
    const res = await adminLogin(formData);
    const { token: newToken, admin: adminData } = res.data.data;
    saveAuth(newToken, adminData);
    return res.data;
  };

  const signup = async (formData) => {
    const res = await adminSignup(formData);
    const { token: newToken, admin: adminData } = res.data.data;
    saveAuth(newToken, adminData);
    return res.data;
  };

  const googleLogin = async (credentialResponse) => {
    const res = await adminGoogleLogin({
      credential: credentialResponse.credential,
    });
    const { token: newToken, admin: adminData } = res.data.data;
    saveAuth(newToken, adminData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, signin, signup, googleLogin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
