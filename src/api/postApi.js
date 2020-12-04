import { http } from '@/plugins/httpPlugin'

const prefix = '/posts'

export default {
  collection(params = null) {
    return http.get(`${prefix}`, {
      params
    })
  },
  create(payload) {
    return http.post(`${prefix}`, payload)
  },
  update(id, payload) {
    return http.post(`${prefix}/${id}`, payload)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
  markSolved(id) {
    return http.patch(`${prefix}/${id}/solved`)
  },
  increaseViews(id) {
    return http.patch(`${prefix}/${id}/views`)
  },
  getAvailableTags() {
    return http.get(`${prefix}/tags`)
  },
  getComments(id, params = null) {
    return http.get(`${prefix}/${id}/comments`, {
      params
    })
  }
}
