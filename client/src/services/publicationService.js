import api from './api';

export const publicationService = {
  getAll: (params = {}) => {
    return api.get('/publications', { params });
  },
  getById: (id) => {
    return api.get(`/publications/${id}`);
  },
  create: (data) => {
    return api.post('/publications', data);
  },
  update: (id, data) => {
    return api.put(`/publications/${id}`, data);
  },
  delete: (id) => {
    return api.delete(`/publications/${id}`);
  },
  exists: (id) => {
    return api.get(`/publications/check/${id}/exists`);
  },
};
