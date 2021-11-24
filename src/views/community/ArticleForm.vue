<template>
  <div class="container color-snow">
    <!-- 새 글 작성 -->
    <div v-if="this.$route.name === 'ArticleForm'">
      <h1 class="title">새 글 작성</h1>
      <div>
        <p v-if=error>{{ error }}</p>
        <b-form-textarea style="max-width:1000px; width:100%; background-color:black; color:white;"
          class="mx-auto"
          v-model="content"
          id="textarea-rows"
          placeholder="내용을 입력하세요."
          rows="8"
          no-resize></b-form-textarea>
        <div class="d-flex justify-content-between mt-5 mx-auto" style="max-width:1000px; width:100%;">
          <div>
            <b-button size="lg" variant="link" style="width:75px; height:75px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="$router.go(-1)"><b-icon-arrow-left></b-icon-arrow-left></b-button>
          </div>
          <div>
            <b-button size="lg" variant="link" style="width:75px; height:75px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="createAritcle"><b-icon-pencil-square></b-icon-pencil-square></b-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 글 수정하기 -->
    <div v-else>
      <h1 class="title">수정하기</h1>
      <div>
        <p v-if=error>{{ error }}</p>
        <b-form-textarea style="max-width:1000px; width:100%; background-color:black; color:white;"
          class="mx-auto"
          v-model="updateContent"
          id="textarea-rows"
          placeholder="내용을 입력하세요."
          rows="8"
          no-resize></b-form-textarea>
        <div class="d-flex justify-content-between mt-5 mx-auto" style="max-width:1000px; width:100%;">
          <div>
            <b-button size="lg" variant="link" style="width:75px; height:75px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="$router.go(-1)"><b-icon-arrow-left></b-icon-arrow-left></b-button>
          </div>
          <div>
            <b-button size="lg" variant="link" style="width:75px; height:75px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="updateAritcle"><b-icon-pencil-square></b-icon-pencil-square></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ArticleForm',
  data: function() {
    return {
      content: '',
      updateContent: this.$route.params.articleContent,
      error: null,
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
    }
  },
  methods: {
    createAritcle(event) {
      event.preventDefault()
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/community/create/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'content': this.content,
          'user': this.$store.state.userStore.userId
        }
      })
        .then((res) => {
          // 글을 작성하면 해당 글 디테일로 이동
          this.$router.push({name : 'ArticleDetail', params:  {article_pk: res.data.id }})
        })
        .catch(err => {
          const error = JSON.parse(err.response.request.response)
          this.error = Object.values(error)[0][0]
          console.log(this.error)
        })
    },
    updateArticle: function () {
      axios({
        method: 'put',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'content': this.updateContent,
          'user': this.$store.state.userStore.userId
        }
      })
        .then(() => {
          this.$router.push({name : 'ArticleDetail', params: {article_pk: this.$route.params.article_pk}})
        })
        .catch(err => {
          console.log(err.response)
        })
    },
  },
  created: function() {
    if (this.$route.name === 'ArticleFormUpdate') {
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.updateContent=res.data.serializer.content
        })
    }
  }
}
</script>

<style>

</style>