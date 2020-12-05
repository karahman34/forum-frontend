import { http } from '@/plugins/httpPlugin'

const prefix = '/comments'

export default {
  create(payload) {
    return http.post(`${prefix}`, payload)
  },
  update(id, payload) {
    return http.patch(`${prefix}/${id}`, payload)
  },
  markSolution(id) {
    return http.patch(`${prefix}/${id}/solution`)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  }
}
