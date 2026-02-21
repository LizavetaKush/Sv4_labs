import api from './api'

export const publicationService = {
  getPublications: async (params = {}) => {
    const response = await api.get('/publications', { params })
    return response.data
  },

  getPublicationById: async (id) => {
    const response = await api.get(`/publications/${id}`)
    return response.data
  },

  createPublication: async (data) => {
    const response = await api.post('/publications', data)
    return response.data
  },

  updatePublication: async (id, data) => {
    const response = await api.put(`/publications/${id}`, data)
    return response.data
  },

  deletePublication: async (id) => {
    const response = await api.delete(`/publications/${id}`)
    return response.data
  },

  checkExists: async (id) => {
    const response = await api.get(`/publications/${id}/exists`)
    return response.data
  },
}
