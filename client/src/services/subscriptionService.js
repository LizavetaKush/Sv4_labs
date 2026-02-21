import api from './api'

export const subscriptionService = {
  getSubscriptions: async (params = {}) => {
    const response = await api.get('/subscriptions', { params })
    return response.data
  },

  getSubscriptionById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`)
    return response.data
  },

  createSubscription: async (data) => {
    const response = await api.post('/subscriptions', data)
    return response.data
  },

  updateSubscription: async (id, data) => {
    const response = await api.put(`/subscriptions/${id}`, data)
    return response.data
  },

  deleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`)
    return response.data
  },

  checkExists: async (id) => {
    const response = await api.get(`/subscriptions/${id}/exists`)
    return response.data
  },
}
