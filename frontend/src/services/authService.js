import { api } from './api.js';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  signup: (email, password, name) => api.post('/auth/signup', { email, password, name }),

  getCurrentUser: () => api.get('/auth/me'),
};
