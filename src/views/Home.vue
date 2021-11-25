<template>
  <div>
    <div class="background-image"
      :style="{ 'background-image': 'url('+`${main_img_str}`+ ')' }">
      <div style="width:100%; height:100vh; position:absolute; background: linear-gradient(to bottom, transparent, 70%, #141414);"></div>
    </div>
    <img alt="Vue logo" src="../assets/logo.png" style="margin-top:100px; max-width:500px; width: 90%">
    <the-search-bar
      :genreList="genreList"
      @search-by-title="searchByTitle"
      @search-by-genre="searchByGenre"></the-search-bar>
    <div style="margin-left:3%">
      <h2 style="color: white; text-align:left;">TOP TRENDING 20</h2>
    </div>
    <movie-card-list
      :movieList="top20List"></movie-card-list>
    <div v-if="isLogin">
      <div v-if="nolikesyet" class="color-snow mt-5" style="height: 300px;">
        <h2>어떤 영화를 좋아하시나요?</h2>
      </div>
      <div v-else>
        <div style="margin-left:3%">
          <h2 style="color: white; text-align:left;">JUST FOR YOU</h2>
        </div>
        <movie-card-list
          :movieList="personalList"></movie-card-list>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import TheSearchBar from '@/components/movies/TheSearchBar.vue'
import MovieCardList from '@/components/movies/MovieCardList.vue'
import _ from 'lodash'

const userStore = 'userStore'
const movieStore = 'movieStore'
// @ is an alias to /src

export default {
  name: 'Home',
  data: function() {
    return {
      top20List: [],
      genreList: [],
      personalList: [],
      nolikesyet: false,
      main_img_num: 0,
      // main_img_str: `@/assets/main_img/${String(_.random(2))}.jpg`,
      main_img_str: `${require('@/assets/main_img/'+String(_.random(2))+'.jpg')}`
    }
  },
  components: {
    MovieCardList,
    TheSearchBar
  },
  methods: {
    ...mapActions(movieStore, [
      'setGenreTable',
    ]),
    // compareMovies(a, b) {

    // },
    searchByGenre: function(searchQuery) {
      this.$router.push({ name: 'SearchResult', params: { criteria: 'genre', query: searchQuery } })
    },
    searchByTitle: function(searchQuery) {
      this.$router.push({ name: 'SearchResult', params: { criteria: 'title', query: searchQuery } })
    },
    calculateGenreScore: function(scopedGenreScore) {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/personal_curation/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          const default_list = res.data.default_list.map(function(e) {
            e['pk'] = e['id']
            return e
          })
          // console.log(default_list)
          let curated_list = []
          if (res.data.message === 'success') {
            // console.log('cur')
            curated_list = JSON.parse(res.data.predictions)
            // console.log(curated_list)
            curated_list = curated_list.map(function(e) {
              const genres = e.genre_id.split(',')
              e['genres'] = genres
              return e
            })
            // console.log(curated_list)
          } else if (res.data.message === 'nolikes') {
            curated_list = []
          }
          const b4obj = curated_list.concat(default_list)
          const obj = b4obj.filter((movie, index, self) => 
            index === self.findIndex((t) => (
              t.pk === movie.pk
            ))
          )
          console.log(obj)
          obj.sort(function (a, b) {
            let ascore = 0
            let bscore = 0
            const a_genre_pk_list = a.genres
            const b_genre_pk_list = b.genres
            // console.log('a')
            // console.log(a)
            for (let agenre of a_genre_pk_list) {
              if (Number(agenre) in scopedGenreScore) {
                ascore += scopedGenreScore[agenre]
              }
            }
            // console.log(ascore)
            // console.log('b')
            // console.log(b)
            for (let bgenre of b_genre_pk_list) {
              if (Number(bgenre) in scopedGenreScore) {
                bscore += scopedGenreScore[bgenre]
              }
            }
            // console.log(bscore)
            return bscore - ascore
          })
          this.personalList = obj.slice(0, 20)
        })
        .catch(({response}) => {
          console.log(response)
        })
    }
  },
  created: function() {
    this.setGenreTable()
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/t20/`,
    })
      .then(res => {
        this.top20List = res.data
      })
      .catch(err => {
        console.log('에러!')
        console.log(err)
      })
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/genres/`,
    })
      .then(res => {
        this.genreList = res.data
      })
      .catch(err => {
        console.log('에러!')
        console.log(err)
      })
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/score/`,
      headers: this.$store.state.userStore.authorized_token,
    })
      .then(res => {
        let scopedGenreScore = {}
        const scorePairs = res.data
        for (let scorePair of scorePairs) {
          scopedGenreScore[scorePair['genre']] = scorePair['score']
        }
        return scopedGenreScore
      })
      .then(scopedGenreScore => {
        this.calculateGenreScore(scopedGenreScore)
      })
      .catch(err => {
        console.log(err)
        this.nolikesyet = true
      })
  },
  computed: {
    ...mapState(userStore, [
      'isLogin',
    ]),
  },
}
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100vh;
    z-index:-1;
    filter: blur(4px);
    position: absolute;
    top: 0px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    display: block;
    width: 100%;
    height: 800px;
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    filter: blur(10px);
  }
</style>