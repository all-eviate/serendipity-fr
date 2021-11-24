<template>
<div>
  <div>
    <div class="d-flex container mb-4">
      <div>
        <router-link :to="{ name: 'Profile', params: { username: article.username }}">
          <b-img 
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            style="max-width:75px; border-radius:50%;"
          ></b-img>
        </router-link>
      </div>
      <div class="d-flex flex-column mb-2" style="width:100%;">
        <div class="d-flex" style="text-align:left; padding-left:30px;">
          <router-link :to="{ name: 'Profile', params: { username: article.username }}" class="text-decoration-none">
            {{article.username}}
          </router-link>
          <div>
            <b-badge class="bg-color-salgu color-night ms-3" v-if="this.userId== article.user">나</b-badge>
          </div>
        </div>
        <router-link :to="{ name: 'ArticleDetail', params: { article_pk: article.id }}" class="text-decoration-none">
        <div style="margin-left:30px; text-align: left;">
          <div class="mt-2">
            <h3 class="content">
              {{ article.content }}
            </h3>
          </div>
        <!-- <router-link :to="{ name: 'ArticleDetail', params: { article_pk: article.id }}" class="text-decoration-none">자세히</router-link> -->
        </div>
        </router-link>
      </div>
      <div>
        <div style="width:180px; text-align:right;">
          <div>
            {{article.created_at.slice(0, 10)}} {{article.created_at.slice(11, 16)}}
          </div>
          <div>
            <b-button size="lg" style="width:80px; color:#F27E63;" variant="link" class="text-decoration-none" disabled>
              <b-icon-heart-fill></b-icon-heart-fill> {{ article.liked_users.length }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div>
      <h1>
        <b-badge style="background-color: #0d6efd;" v-if="this.userId== article.user">내글</b-badge>
        {{ article.content }}
      </h1>
    </div> -->
    <!-- <b-card-text> {{ id }}번째 게시글</b-card-text> -->
    <!-- <div> {{ article.liked_users.length }}명이 좋아합니다.</div>
    <div> 작성 시간 : {{ article.created_at.substring(0, this.article.created_at.indexOf('.')) }} / 수정 시간 : {{ article.updated_at.substring(0, this.article.created_at.indexOf('.')) }}</div>
    <router-link :to="{ name: 'ArticleDetail', params: { article_pk: article.id }}" class="text-decoration-none">자세히</router-link> -->
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
const userStore = 'userStore'

export default {
  name: "ArticleListItem",
  props: {
    article: {
      type: Object
    }
  },
  data: function() {
    return {
      profile_path: ''
    }
  },
  computed: {
    ...mapState(userStore, [
      'userId'
  ]),
  },
  created: function() {
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/accounts/${this.article.username}/`,
      headers: this.$store.state.userStore.authorized_token,
    })
      .then(({data}) => {
        this.profile_path = data.user.profile_path
      })
  }
}
</script>

<style scoped>
  .content {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
</style>