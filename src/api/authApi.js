import { http } from '@/plugins/httpPlugin'

const prefix = '/auth'

export default {
  login(payload) {
    return http.post(`${prefix}/login`, payload)
  },
  register(payload) {
    return http.post(`${prefix}/register`, payload)
  },
  user() {
    return http.get(`${prefix}/me`)
  },
  refresh() {
    return http.post(`${prefix}/refresh`)
  },
  logout() {
    return http.post(`${prefix}/logout`)
  }
}
