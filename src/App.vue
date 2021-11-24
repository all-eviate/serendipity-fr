<template>
  <div id="app">
    <b-navbar style="transition:0.3s;" :style="[isTop ? {'background': 'linear-gradient(to top, transparent, #141414)'} : {'background': '#141414'}]" toggleable="sm" type="dark" fixed="top">
      <div class="container-fluid">
        <b-navbar-brand class="my-0 py-0">
          <router-link to="/">
            <img alt="logo" src="@/assets/logo.png" style="height: 50px">
          </router-link>
        </b-navbar-brand>
        
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        
        <b-collapse id="nav-collapse" class="justify-content-between" is-nav>
          <div>
            <b-navbar-nav v-if="isLogin">
              <b-nav-item>
                <router-link :to="{ name: 'EnterTarot'}" class="color-snow text-decoration-none">타로</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link :to="{ name: 'ArticleList' }" class="color-snow text-decoration-none">자유 게시판</router-link>
              </b-nav-item>
            </b-navbar-nav>
          </div>
          <!-- Right aligned nav items -->
          <b-navbar-nav v-if="isLogin">
            <b-nav-item>
              <router-link
                :to="{ name: 'Profile', params: { username: username }}"
                class="color-snow text-decoration-none"
                >
                  프로필
                </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link @click.native="logout" :to="{ name: 'Home' }" class="color-snow text-decoration-none">로그아웃</router-link>
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav v-else>
            <b-nav-item>
              <router-link :to="{ name: 'Login' }" class="color-snow text-decoration-none">로그인</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link :to="{ name: 'Signup' }" class="color-snow text-decoration-none">회원가입</router-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
    <router-view :key="$route.path"/>
  </div>
</template>

<script>
import { mapState, } from 'vuex'

const userStore = 'userStore'

export default {
  name: 'App',
  data: function () {
    return {
      scrollPosition: null,
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('userStore/logout')
    },
    updateScroll() {
      this.scrollPosition = window.scrollY
    }
  },
  computed: {
    ...mapState(userStore, [
      'isLogin',
      'token',
      'authorized_token',
      'username',
    ]),
    isTop: function() {
      if (this.scrollPosition > 0) {
        return false
      } else {
        return true
      }
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.updateScroll)
  }
}
</script>


<style>
  ::-webkit-scrollbar {
    display: none;
  }
  @import './assets/styles/main.css';
  #app {
    font-family: GmarketSansMedium, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>