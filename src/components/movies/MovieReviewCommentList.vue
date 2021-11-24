<template>
  <div style="margin-top: 50px; margin-top: 30px;">
    <movie-review-comment-list-item
      v-for="movieReviewComment in movieReviewComments"
      :key="movieReviewComment.id"
      :movieReviewComment="movieReviewComment"
      @delete-review-comment="deleteComment(movieReviewComment.id)"></movie-review-comment-list-item>
    <movie-review-comment-form
      :reviewPk="reviewPk"
      @create-review-comment="createComment"></movie-review-comment-form>
    <b-button class="text-decoration-none text-dark" :id="`review-${reviewPk}`" v-if="!EOP" variant="link" @click="getNextPage">더보기</b-button>
  </div>
</template>

<script>
import axios from 'axios'
import MovieReviewCommentForm from './MovieReviewCommentForm.vue'
import MovieReviewCommentListItem from './MovieReviewCommentListItem.vue'

export default {
  components: {
    MovieReviewCommentForm,
    MovieReviewCommentListItem,
  },
  name: "MovieReviewCommentList",
  props: {
    reviewPk: {
      type: String,
    }
  },
  data: function () {
    return {
      reviewComments: [],
      reviewCommentContent: '',
      pageNum: 2,
      EOP: false,
    }
  },
  methods: {
    createComment: function() {
      this.getAllReviewComments()
      this.$emit('create-review-comment')
    },
    deleteComment: function(id) {
      this.reviewComments = this.reviewComments.filter(comment => comment.id !== id)
      this.$emit('delete-review-comment')
    },
    getReviewComments: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.reviewPk}/comment/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.reviewComments = res.data.serializer
        })
        .catch(err => {
          if (err.response.status === 404) {
            this.EOP = true
            this.reviewComments = []
          }
        })
    },
    getAllReviewComments: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/${this.reviewPk}/comment/all/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.reviewComments = res.data
          this.EOP = true
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    getNextPage: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      if (!this.EOP){
        axios({
          method: 'get',
          url: `${SERVER_URL}/movies/${this.reviewPk}/comment/?page=${this.pageNum}`,
          headers: this.$store.state.userStore.authorized_token,
        })
          .then(res => {
            this.reviewComments = this.reviewComments.concat(res.data.serializer)
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
    this.getReviewComments()
  },
  computed: {
    movieReviewComments: function() {
      return this.reviewComments
    }
  },
  // mounted: function() {
  //   let pageNum = 2
  //   const seeMore = document.querySelector(`#review-${this.reviewPk}`)
  //   seeMore.addEventListener('click', () => {
  //     const SERVER_URL = process.env.VUE_APP_SERVER_URL
  //     if (!this.EOP){
  //       axios({
  //         method: 'get',
  //         url: `${SERVER_URL}/movies/${this.reviewPk}/comment/?page=${pageNum}`,
  //         headers: this.$store.state.userStore.authorized_token,
  //       })
  //         .then(res => {
  //           this.reviewComments = this.reviewComments.concat(res.data.serializer)
  //           pageNum += 1
  //           if (!res.data.hasNext) {
  //             this.EOP = true
  //           }
  //         })
  //         .catch(err => {
  //           if (err.response.status === 400) {
  //             this.EOP = true
  //           }
  //         })
  //     }
  //   })
  // }
}
</script>

<style>

</style>