import api from './api'

export const recipientService = {
  getRecipients: async (params = {}) => {
    const response = await api.get('/recipients', { params })
    return response.data
  },

  getRecipientById: async (id) => {
    const response = await api.get(`/recipients/${id}`)
    return response.data
  },

  createRecipient: async (data) => {
    const response = await api.post('/recipients', data)
    return response.data
  },

  updateRecipient: async (id, data) => {
    const response = await api.put(`/recipients/${id}`, data)
    return response.data
  },

  deleteRecipient: async (id) => {
    const response = await api.delete(`/recipients/${id}`)
    return response.data
  },

  checkExists: async (id) => {
    const response = await api.get(`/recipients/${id}/exists`)
    return response.data
  },
}
