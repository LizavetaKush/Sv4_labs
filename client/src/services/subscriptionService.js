import api from './api';

export const subscriptionService = {
  getAll: (params = {}) => {
    return api.get('/subscriptions', { params });
  },
  getById: (id) => {
    return api.get(`/subscriptions/${id}`);
  },
  create: (data) => {
    return api.post('/subscriptions', data);
  },
  update: (id, data) => {
    return api.put(`/subscriptions/${id}`, data);
  },
  delete: (id) => {
    return api.delete(`/subscriptions/${id}`);
  },
  exists: (id) => {
    return api.get(`/subscriptions/check/${id}/exists`);
  },
};
