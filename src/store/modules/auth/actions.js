import authApi from '@/api/authApi'
import { removeToken, setToken } from '@/plugins/httpPlugin'

export default {
  async register({ commit }, payload) {
    try {
      const res = await authApi.register(payload)
      const { ok, data } = res.data
      const { user, access_token, type, expired_in } = data

      if (!ok) return Promise.reject(res)

      // Commit changes
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      // Apply token to the Http
      const token = `${type.charAt(0).toUpperCase()}${type.slice(
        1
      )} ${access_token}`
      setToken(token, expired_in)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async login({ commit }, payload) {
    try {
      const res = await authApi.login(payload)
      const { ok, data } = res.data
      const { user, access_token, type, expired_in } = data

      if (!ok) return Promise.reject(res)

      // Commit changes
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      // Apply token to the Http
      const token = `${type.charAt(0).toUpperCase()}${type.slice(
        1
      )} ${access_token}`
      setToken(token, expired_in)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async getUser({ commit }) {
    try {
      const res = await authApi.user()
      const { ok, data } = res.data

      if (!ok) return Promise.reject(res)

      // Commit changes
      commit('SET_USER', data.user)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async logout({ commit }) {
    try {
      const res = await authApi.logout()
      const { ok } = res.data

      if (!ok) return Promise.reject(res)

      // Commit changes
      commit('SET_USER', null)
      commit('SET_LOGGED_IN', false)

      // Remove token from HTTP
      removeToken()

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
