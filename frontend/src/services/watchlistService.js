import { api } from './api.js';

export const watchlistService = {
  getAll: (status) => {
    const queryString = status ? `?status=${status}` : '';
    return api.get(`/watchlist${queryString}`);
  },

  add: (movieId, status = 'WATCHLIST') =>
    api.post('/watchlist', { movieId, status }),

  updateStatus: (id, status) =>
    api.put(`/watchlist/${id}`, { status }),

  remove: (id) => api.delete(`/watchlist/${id}`),

  removeByMovieId: (movieId) => api.delete(`/watchlist/movie/${movieId}`),
};
