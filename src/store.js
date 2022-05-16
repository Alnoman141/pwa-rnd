import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedPhoto: null,
    capturedPhotos: [],
  },
  mutations: {
    getSelectedPhoto(state, payload) {
      state.selectedPhoto = payload
    },
    getCapturedPhotos(state, payload) {
      state.capturedPhotos = payload
    }
  },
  actions: {
    getSelectedPhoto({ commit }, payload) {
      commit('getSelectedPhoto', payload)
    },
    getCapturedPhotos({ commit }, payload) {
      commit('getCapturedPhotos', payload)
    }
  }
})
