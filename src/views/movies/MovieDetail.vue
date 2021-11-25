<template>
  <div class="color-night">
    <div style="height:100vh;">
      <div class="bg"
        :style="{'background-image': 'url(' + `${backdrop_path}` + ')' }"
        >
        <div style="width:100%; height:100%; background: linear-gradient(to bottom, transparent, 80%, black);"></div>
      </div>
    </div>
    <b-container class="absolute">
      <div class="front">
        <b-row align-v="center" class="d-flex">
          <b-col cols="12" lg="6" xl="5">
            <img :src="poster_path" alt="poster" style="margin:20px; width:90%">
          </b-col>
          <b-col cols="12" lg="6" xl="7">
            <div class="d-flex flex-column justify-content-between" style="margin:20px; text-align:left;">
              <h1 style="margin-right:10px;">{{ title }}</h1>
              <span>
                <h4 style="display: inline;">{{ release_date.slice(0, 4) }}년 {{ release_date.slice(5, 7) }}월 {{ release_date.slice(8, 10) }}일 개봉</h4>
                <h4 v-if="release_date > date" style="display: inline;"> 예정</h4>
              </span>
              <p class="overview overflow">{{ overview }}</p>
              <div>
                <h4>등장인물</h4>
                <actors-list
                  class="overflow"
                  :actors="actors"></actors-list>
              </div>
              <p>{{ genres }}</p>
              <div v-if="isLogin" class="d-flex flex-row">
                <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#8C2016;" variant="link" class="text-decoration-none" @click="tabomToggle" v-if="tabom"><b-icon-heart-fill></b-icon-heart-fill> {{likes_count}}</b-button>
                <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:black;" variant="link" class="text-decoration-none" @click="tabomToggle" v-else><b-icon-heart></b-icon-heart> {{likes_count}}</b-button>
                <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#D9D3C1;" variant="link" class="text-decoration-none" v-if="wish" @click="wishToggle"><b-icon-bookmark-plus-fill></b-icon-bookmark-plus-fill> {{ wish_count }}</b-button>
                <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:black;" variant="link" class="text-decoration-none" v-else @click="wishToggle"><b-icon-bookmark-plus></b-icon-bookmark-plus> {{ wish_count }}</b-button>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <div class="container mt-5">
        <movie-review-list
          v-if="isLogin"
          :moviePk="String(this.$route.params.movie_pk)"></movie-review-list>
        <div
          v-else class="color-snow">
          <h2>리뷰를 보거나 남기시려면 로그인하세요.</h2>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import MovieReviewList from '@/components/movies/MovieReviewList.vue'
import ActorsList from '@/components/movies/ActorsList.vue'

const userStore = 'userStore'

export default {
  components: {
    MovieReviewList,
    ActorsList,
  },
  name: "MovieDetail",
  data: function() {
    return {
      date: '',
      id: '',
      poster_path: '',
      backdrop_path: '',
      title: '',
      release_date: '',
      overview: '',
      genreTable: [],
      genre_pk_list: [],
      genres: '',
      likes_count: 0,
      wish_count: 0,
      tabom: false,
      wish: false,
      reviews: [],
      actors: [],
    }
  },
  methods: {
    getDetail: function() {
      const movie_pk = this.$route.params.movie_pk
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${movie_pk}`
      })
        .then(res => {
          this.poster_path = `https://image.tmdb.org/t/p/w780${res.data.poster_path}`
          this.backdrop_path = `https://image.tmdb.org/t/p/w780${res.data.backdrop_path}`
          this.id = res.data.id
          this.title = res.data.title
          this.overview = res.data.overview
          this.release_date = res.data.release_date
          this.likes_count = res.data.liked_users.length
          this.wish_count = res.data.wished_users.length
          this.tabom = res.data.liked_users.includes(this.userId)
          this.wish = res.data.wished_users.includes(this.userId)
          this.genre_pk_list = res.data.genres
          const genre_picked_list = this.genreTable.filter(element => this.genre_pk_list.includes(element.id))
          const genre_name_list = genre_picked_list.map(element => element.name)
          this.genres = `장르: ${genre_name_list.join(', ')}`
        })
        .catch(({response}) => {
          console.log(response)
          if (response.status === 404) {
            this.$router.push({name: '404'})
          }
        })
    },
    setGenreTable: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
          method: 'get',
          url: `${SERVER_URL}/movies/genres/`,
        })
          .then(res => {
            this.genreTable = res.data
          })
          .catch(err => {
            console.log('에러!')
            console.log(err)
          })
    },
    getActors: function() {
      const movie_pk = this.$route.params.movie_pk
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${movie_pk}/actors`
      })
        .then(res => {
          this.actors = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    tabomToggle: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      this.tabom = !this.tabom
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${this.id}/like/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.likes_count = res.data.likers
        })
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${this.id}/like/score/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .catch(err => {
          console.log(err)
        })
    },
    wishToggle: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      this.wish = !this.wish
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${this.id}/wish/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.wish_count = res.data.wishes
        })
    },
    getToday: function() {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth()).padStart(2, '0')
      const yyyy = today.getFullYear()

      this.date = yyyy+'-'+mm+'-'+dd
    }
  },
  created: function() {
    this.setGenreTable()
    this.getDetail()
    this.getToday()
    this.getActors()
  },
  mounted: function() {
    window.scrollTo(0, 0)
  },
  computed: {
    ...mapState(userStore, [
      'isLogin',
      'userId',
    ])
  }
}
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100vh;
    filter: blur(8px);
    position: absolute;
    top: 0px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .absolute {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
  }

  .front {
    backdrop-filter: blur(50px) contrast(.3);
    border-radius: 20px;
    /* position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%); */
    /* z-index: 2; */
  }

  .overview {
    height: 120px;
  }

  .overflow {
    overflow: auto;
  }

  .overflow::-webkit-scrollbar {
    display: none;
  }
</style>