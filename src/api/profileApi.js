import { http } from '@/plugins/httpPlugin'

const prefix = '/profile'

export default {
  updateProfile(payload) {
    return http.post(`${prefix}`, payload)
  },
  updatePassword(payload) {
    return http.post(`${prefix}/password`, payload)
  }
}
