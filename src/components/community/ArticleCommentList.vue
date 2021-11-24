<template>
  <div style="margin-top: 50px;">
    <h3>댓글 작성</h3>
    <p v-if=error>{{ error }}</p>
    <article-comment-form
      :articlePk="articlePk"
      @create-comment="createComment"></article-comment-form>
    <article-comment-list-item
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      @delete-article-comment="deleteComment(comment.id)"></article-comment-list-item>
    <b-button class="text-decoration-none my-4" style="color:#E5E5E5" v-if="!EOP" variant="link" @click="getNextPage">더보기</b-button>
  </div>
</template>

<script>
import axios from 'axios'
import ArticleCommentListItem from '@/components/community/ArticleCommentListItem.vue'
import ArticleCommentForm from '@/components/community/ArticleCommentForm.vue'

export default {
  components: {
    ArticleCommentForm,
    ArticleCommentListItem,
  },
  name: "ArticleCommentList",
  props: {
    articlePk: {
      type: String,
    }
  },
  data: function() {
    return {
      comments: [],
      commentContent: '',
      EOP: false,
      pageNum: 2,
    }
  },
  methods: {
    createComment: function() {
      this.getAllComments()
      this.$emit('create-comment')
    },
    getComments: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${this.articlePk}/comments/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(({data}) => {
          console.log(data)
          this.comments = data
        })
        .catch(({response}) => {
          if (response.status === 404) {
            this.EOP = true
            this.reviews = []
          }
        })
    },
    deleteComment: function(id) {
      this.comments = this.comments.filter(comment => comment.id !== id)
      this.$emit('delete-comment')
    },
    getAllComments: function() {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/community/${this.articlePk}/comments/all/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(({data}) => {
          this.comments = data
          this.EOP = true
        })
        .catch(({response}) => {
          console.log(response)
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
          url: `${SERVER_URL}/community/${this.articlePk}/comments?page=${this.pageNum}`,
          headers: this.$store.state.userStore.authorized_token,
        })
          .then(res => {
            this.comments = this.comments.concat(res.data)
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
    },
  },
  created: function() {
    this.getComments()
  }
}
</script>

<style>

</style>