<template>
  <div style="margin-top: 50px;">
    <h1 class="color-snow">리뷰를 남겨주세요</h1>
    <movie-review-form
      :moviePk="moviePk"
      @create-review="getAllReviews"></movie-review-form>
    <movie-review-list-item
      v-for="movieReview in reviews"
      :key="movieReview.id"
      :movieReview="movieReview"
      @delete-review="delReview(movieReview.id)"></movie-review-list-item>
    <b-button class="text-decoration-none my-4" style="color:#E5E5E5" v-if="!EOP" variant="link" @click="getNextPage">더보기</b-button>
  </div>
</template>

<script>
import axios from 'axios'
import MovieReviewListItem from '@/components/movies/MovieReviewListItem.vue'
import MovieReviewForm from '@/components/movies/MovieReviewForm.vue'

export default {
  components: {
    MovieReviewListItem,
    MovieReviewForm,
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
      pageNum: 2,
    }
  },
  methods: {
    getReviews: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.moviePk}/review/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          console.log(res.data)
          this.reviews = res.data
        })
        .catch(err => {
          if (err.response.status === 404) {
            this.EOP = true
            this.reviews = []
          }
        })
    },
    delReview: function(id) {
      this.reviews = this.reviews.filter(review => review.id !== id)
    },
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
    },
    getNextPage: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      if (!this.EOP) {
        axios({
          method: 'get',
          url: `${SERVER_URL}/movies/${this.moviePk}/review/?page=${this.pageNum}`,
          headers: this.$store.state.userStore.authorized_token,
        })
          .then(res => {
            this.reviews = this.reviews.concat(res.data)
            this.pageNum += 1
            if (!res.data.hasNext) {
              this.EOP = true
            }
          })
          .catch(err => {
            if (err.response.status === 400) {
              this.EOP = true
            }
          })
      }
    }
  },
  created: function() {
    this.getReviews()
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