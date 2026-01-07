import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // isAuthenticated ne doit être true que si nous avons à la fois le token et l'utilisateur, et que le chargement est terminé
  const isAuthenticated = !loading && !!token && !!user;

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    // Définir le token immédiatement pour qu'il soit disponible pendant la vérification
    setToken(storedToken);

    try {
      // getCurrentUser retourne l'objet utilisateur directement
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Ne supprimer le token que s'il s'agit d'une erreur d'authentification (401)
      // Les erreurs réseau ne doivent pas déconnecter l'utilisateur
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, token: userToken } = response;

      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await authService.signup(email, password, name);
      const { user: userData, token: userToken } = response;

      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
