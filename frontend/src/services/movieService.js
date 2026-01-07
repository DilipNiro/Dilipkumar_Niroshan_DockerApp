import { api } from './api.js';

export const movieService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.year) params.append('year', filters.year);
    if (filters.search) params.append('search', filters.search);
    if (filters.title) params.append('search', filters.title); // Support both for backward compatibility

    const queryString = params.toString();
    return api.get(`/movies${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => api.get(`/movies/${id}`),

  create: (movieData) => api.post('/movies', movieData),

  update: (id, movieData) => api.put(`/movies/${id}`, movieData),

  delete: (id) => api.delete(`/movies/${id}`),
};
