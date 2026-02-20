import api from './api';

export const authService = {
  register: (data) => {
    return api.post('/auth/register', data);
  },
  login: (data) => {
    return api.post('/auth/login', data);
  },
  getMe: () => {
    return api.get('/auth/me');
  },
  changePassword: (data) => {
    return api.put('/auth/change-password', data);
  },
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: (data) => {
    return api.post('/auth/reset-password', data);
  },
};
