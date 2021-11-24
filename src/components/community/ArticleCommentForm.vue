<template>
    <div style="margin-top: 50px; margin-bottom: 30px;" class="mx-auto">
      <div class="d-flex justify-content-center">
        <b-form-textarea style="max-width:760px; width:100%; background-color:black; color:white;"
          v-model="commentContent"
          placeholder="내용을 입력하세요."
          no-resize></b-form-textarea>
        <b-button style="width:60px;" @click="createComment" variant="outline-light"><b-icon-pencil-square></b-icon-pencil-square></b-button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "ArticleCommentForm",
  props: {
    articlePk: {
      type: String,
    }
  },
  data: function() {
    return {
      commentContent: '',
    }
  },
  methods: {
    createComment: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'post',
        url: `${SERVER_URL}/community/${this.articlePk}/comments/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'user': this.$store.state.userStore.userId,
          'content': this.commentContent,
        }
      })
        .then(() => {
          this.commentContent = ""
          this.$emit("create-comment")
        })
        .catch(({response}) => {
          console.log(response)
          if (response.status === 404) {
            alert("삭제된 게시글입니다.")
          }
        })
    },
  }
}
</script>

<style>

</style>