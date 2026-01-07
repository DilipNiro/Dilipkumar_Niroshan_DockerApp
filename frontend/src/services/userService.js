import { api } from './api.js';

export const userService = {
  /**
   * Obtenir tous les utilisateurs (admin uniquement)
   */
  getAll: async () => {
    return await api.get('/users');
  },

  /**
   * Obtenir un utilisateur par ID
   */
  getById: async (id) => {
    return await api.get(`/users/${id}`);
  }
};

