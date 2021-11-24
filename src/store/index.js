import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 저장소 나누기 -> 모듈 import
import userStore from '@/store/modules/userStore.js'
import movieStore from '@/store/modules/movieStore.js'


const store = new Vuex.Store({
  modules: {
    // 키 값 형태로 저장
    userStore: userStore,
    movieStore: movieStore
  },
  // vuex-persistedstate 플러그인 사용
  plugins: [
    createPersistedState({
      key: 'userAuth',
      paths: ['userStore'],
      reducer (val) {           
        if(val.userStore.isLogin === false) { // return empty state when user logged out                
          return {} // vuex 초기화
        }
        return val
      }
    })
  ]
})

export default store