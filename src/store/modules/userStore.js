import Vue from 'vue'
import Vuex from 'vuex'
import jwt_decode from 'jwt-decode'

Vue.use(Vuex)

const userStore = {
  namespaced: true,
  state: {
    isLogin: false,
    token: null,
    authorized_token: null,
    username: null,
    userId: null,
  },
  mutations: {
    LOGIN: function (state) {
      state.isLogin = true
      state.token = localStorage.getItem('jwt')
      state.authorized_token = {
        Authorization: `JWT ${state.token}`
      }
      try {
        // console.log(jwt_decode(state.token))
        state.username = jwt_decode(state.token)['username']
        state.userId = jwt_decode(state.token)['user_id']
      } catch (err) {
        console.log(err)
      }
    },
    LOGOUT: function (state) {
      // 사용자 정보 초기화
      state.isLogin = false
      state.authorized_token = null,
      state.token = '',
      state.username = '',
      state.userId = '',
      localStorage.removeItem('jwt')
    },
  },
  actions: {
    login: function({commit}) {
      commit('LOGIN')
    },
    logout: function({commit}) {
      commit('LOGOUT')
    },
  },
  modules: {
  },
}

export default userStore