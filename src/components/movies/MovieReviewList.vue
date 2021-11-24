<template>
  <div style="margin-top: 50px;">
    <h1 class="color-snow">리뷰를 남겨주세요</h1>
    <movie-review-form
      :moviePk="moviePk"
      @create-review="getReviews"></movie-review-form>
    <movie-review-list-item
      v-for="movieReview in list"
      :key="movieReview.id"
      :movieReview="movieReview"
      @delete-review="delReview(movieReview.id)"></movie-review-list-item>
    <infinite-loading spinner="spiral" @infinite="infiniteHandler">
      <div slot="no-more">끝! :) <br> <b-button variant="link" @click="toTop" class="text-decoration-none color-snow mb-5">TO TOP</b-button></div>
      <div slot="no-results">No results :(</div>
      <div slot="error">첫 리뷰를 남겨주세요!</div>
    </infinite-loading>
  </div>
</template>

<script>
import axios from 'axios'
import MovieReviewListItem from '@/components/movies/MovieReviewListItem.vue'
import MovieReviewForm from '@/components/movies/MovieReviewForm.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    MovieReviewListItem,
    MovieReviewForm,
    InfiniteLoading,
  },
  name: "MovieReviewList",
  props: {
    moviePk: {
      type: String,
    }
  },
  data: function () {
    return {
      reviews: [],
      reviewContent: '',
      EOP: false,

      page: 1,
      list: [],
    }
  },
  methods: {
    infiniteHandler($state) {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.moviePk}/review/?page=${this.page}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(({data}) => {
          console.log(data)
          if (data.length) {
            this.page += 1
            this.list.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch(({response}) => {
          if (response.status === 404) {
            $state.error()
          }
          console.log(response)
        })
    },
    delReview: function(id) {
      this.list = this.list.filter(review => review.id !== id)
    },
    // getReviews: function() {
    //   const SERVER_URL = process.env.VUE_APP_SERVER_URL
    //   axios({
    //     method: 'get',
    //     url: `${SERVER_URL}/movies/${this.moviePk}/review/`,
    //     headers: this.$store.state.userStore.authorized_token,
    //   })
    //     .then(res => {
    //       this.list = res.data
    //     })
    //     .catch(err => {
    //       if (err.response.status === 404) {
    //         this.reviews = []
    //       }
    //     })
    // },
    getAllReviews: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.moviePk}/review/all/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.reviews = res.data
          this.EOP = true
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    toTop: function() {
      window.scrollTo(0, 0)
    }
    // createReview: function() {
    //   const SERVER_URL = process.env.VUE_APP_SERVER_URL
    //   axios({
    //     method: 'post',
    //     url: `${SERVER_URL}/movies/${this.moviePk}/review/`,
    //     headers: this.$store.state.userStore.authorized_token,
    //     data: {
    //       'user': this.$store.state.userStore.userId,
    //       'content': this.reviewContent,
    //     }
    //   })
    //     .then(() => {
    //       this.reviewContent = ""
    //       this.getReviews()
    //     })
    //     .catch(err => {
    //       console.log(err.response)
    //     })
    // }
  },
  created: function() {
    // this.getReviews()
  },
  // mounted: function() {
  //   let pageNum = 2
  //   document.addEventListener('scroll', () => {
  //     const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  //     if (scrollHeight - scrollTop === clientHeight) {
  //       const SERVER_URL = process.env.VUE_APP_SERVER_URL
  //       if (!this.EOP){
  //         axios({
  //           method: 'get',
  //           url: `${SERVER_URL}/movies/${this.moviePk}/review/?page=${pageNum}`,
  //           headers: this.$store.state.userStore.authorized_token,
  //         })
  //           .then(res => {
  //             this.reviews = this.reviews.concat(res.data)
  //             pageNum += 1
  //           })
  //           .catch(err => {
  //             if (err.response.status === 400) {
  //               this.EOP = true
  //             }
  //           })
  //       }
  //     }
  //   })
  // },
  computed: {
    movieReviews: function() {
      return this.reviews
    }
  },
  // beforeDestroy: function() {
  //   document.removeEventListener('scroll', () => {})
  // },
}
</script>

<style>

</style>