import { api } from './api.js';

export const genreService = {
  /**
   * Get all genres
   */
  getAll: async () => {
    return await api.get('/genres');
  }
};

