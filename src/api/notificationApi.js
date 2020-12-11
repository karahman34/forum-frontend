import { http } from '@/plugins/httpPlugin'

const prefix = 'notifications'

export default {
  collection(params = null) {
    return http.get(`${prefix}`, {
      params
    })
  },
  open() {
    return http.patch(`${prefix}/open`)
  },
  markRead(id) {
    return http.patch(`${prefix}/${id}/read`)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  }
}
