<template>
  <div id="personalMovie" class="container color-snow">
    <div v-if="this.$route.path === `/accounts/${this.$route.params.username}/like`">
      <h1>좋아하는 영화들</h1>
      <div class="d-flex">
        <sequential-entrance fromTop>
          <div
            v-for="movie in liked_movies"
            :key="movie.id"
          >
            <user-movie-list-item             
              :movie="movie"
            ></user-movie-list-item>
          </div>
        </sequential-entrance>
      </div>
    </div>
    <div v-else>
      <h1>보고싶은 영화들</h1>
      <div class="d-flex">
        <sequential-entrance fromTop>
          <div
            v-for="movie in wished_movies"
            :key="movie.id"
          >
            <user-movie-list-item             
              :movie="movie"
            ></user-movie-list-item>
          </div>
        </sequential-entrance>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UserMovieListItem from '@/components/accounts/UserMovieListItem.vue'

export default {
  name: 'UserMovieList',
  components: { 
    UserMovieListItem 
  },
  data: function () {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,

      // 사용자의 영화 정보
      liked_movies: [],
      wished_movies: [],
    }
  },
  methods: {
    getMovies: function() {
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}/movies`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          // 영화 관련
          this.liked_movies = res.data.liked_movies.reverse()
          this.wished_movies = res.data.wishlisted_movies.reverse()
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
  created: function() {
    this.getMovies()
  },
}
</script>

<style scoped>
#personalMovie > div > div > span {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>