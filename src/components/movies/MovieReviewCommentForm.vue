<template>
  <div style="max-width:600px; margin: 0 0 0 100px;">
    <div class="d-flex justify-content-center">
      <b-form-textarea style="max-width:760px; width:100%;"
        v-model="reviewCommentContent"
        no-resize></b-form-textarea>
      <b-button style="width:60px;" @click="createReviewComment" variant="outline-dark"><b-icon-pencil-square></b-icon-pencil-square></b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "MovieReviewCommentForm",
  props: {
    reviewPk: {
      type: String,
    }
  },
  data: function () {
    return {
      reviewCommentContent: '',
    }
  },
  methods:{
    createReviewComment: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'post',
        url: `${SERVER_URL}/movies/${this.reviewPk}/comment/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'user': this.$store.state.userStore.userId,
          'content': this.reviewCommentContent,
        }
      })
        .then(() => {
          this.reviewCommentContent = ""
          this.$emit("create-review-comment")
        })
        .catch(err => {
          console.log(err.response)
          if (err.response === 404) {
            alert("설마 여기서 404 에러가 뜨려고?")
          }
        })
    }
  }
}
</script>

<style>

</style>