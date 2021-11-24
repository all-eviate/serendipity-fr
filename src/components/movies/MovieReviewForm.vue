<template>
  <div style="max-width:800px; margin-top: 50px; margin-bottom: 30px;" class="mx-auto">
    <div class="d-flex justify-content-center">
      <b-form-textarea style="max-width:760px; width:100%; background-color:black; color:white;"
        v-model="reviewContent"
        no-resize></b-form-textarea>
      <b-button style="width:60px;" @click="createReview" variant="outline-light"><b-icon-pencil-square></b-icon-pencil-square></b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "MovieReviewForm",
  props: {
    moviePk: {
      type: String,
    }
  },
  data: function () {
    return {
      reviewContent: '',
    }
  },
  methods:{
    createReview: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${this.moviePk}/review/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'user': this.$store.state.userStore.userId,
          'content': this.reviewContent,
        }
      })
        .then(() => {
          this.reviewContent = ""
          this.$emit("create-review")
        })
        .catch(err => {
          console.log(err.response)
          if (err.response === 404) {
            alert("설마 404?")
          }
        })
    }
  }
}
</script>

<style>

</style>