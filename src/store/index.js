import postApi from '@/api/postApi'
import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tags: null
  },
  mutations: {
    SET_TAGS(state, tags) {
      state.tags = tags
    }
  },
  actions: {
    async getTags({ commit }) {
      try {
        const res = await postApi.getAvailableTags()
        const { data } = res.data

        commit('SET_TAGS', data)

        return Promise.resolve(res)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  },
  modules: {
    auth
  }
})
