import api from './api';

export const recipientService = {
  getAll: (params = {}) => {
    return api.get('/recipients', { params });
  },
  getById: (id) => {
    return api.get(`/recipients/${id}`);
  },
  create: (data) => {
    return api.post('/recipients', data);
  },
  update: (id, data) => {
    return api.put(`/recipients/${id}`, data);
  },
  delete: (id) => {
    return api.delete(`/recipients/${id}`);
  },
  exists: (id) => {
    return api.get(`/recipients/check/${id}/exists`);
  },
};
