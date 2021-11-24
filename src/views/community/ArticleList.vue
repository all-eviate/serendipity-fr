<template>
  <div class="container color-snow">
    <h1 class="mb-3">자유 게시판!</h1>
    <p class="text-muted mb-5">좋아하는 사람이 많은 순서대로 나열합니다.</p>
    <router-link :to="{ name: 'ArticleForm'}" class="color-snow text-decoration-none">
      <b-button
        class="fixed-button btn-color-sub"
        style="width:100px; height:100px; border-radius:50%;"><b-icon-pencil-square></b-icon-pencil-square></b-button>
    </router-link>
    <article-list-item 
      v-for="article in articleList"
      :key="article.id"
      :article="article"
      >
    </article-list-item>
  </div>
</template>

<script>
import axios from 'axios'
import ArticleListItem from '@/components/community/ArticleListItem.vue'
// import { mapState } from 'vuex'

export default {
  name: 'Community',
  data: function() {
    return {
      articleList: [],
    }
  },
  components: {
    ArticleListItem
  },
  methods: {
  },
  created: function() {
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/community/`,
      headers: this.$store.state.userStore.authorized_token,
    })
      .then(res => {
        this.articleList = res.data
      })
      .catch(err => {
        console.log('에러!')
        console.log(err)
      })
  }
}
</script>

<style>

</style>