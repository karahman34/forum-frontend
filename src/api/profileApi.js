import { http } from '@/plugins/httpPlugin'

const prefix = '/profile'

export default {
  updateProfile(payload) {
    return http.post(`${prefix}`, payload)
  },
  updatePassword(payload) {
    return http.post(`${prefix}/password`, payload)
  },
  getUserInfo(username) {
    return http.get(`${prefix}/${username}`)
  },
  getPosts(username, params = null) {
    return http.get(`${prefix}/${username}/posts`, {
      params
    })
  }
}
