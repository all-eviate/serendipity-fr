<template>
  <div>
    <b-card class="article-card color-snow my-3">
      <b-card-text>
        <h2>
          {{ review.content }}
        </h2>
        <b-card-text class="color-sub"> <b-icon-heart-fill></b-icon-heart-fill><span class="ms-2">{{ review.liked_users.length }}</span></b-card-text>
        <div v-if="this.userId!==review.user">작성자: {{ review.username }}</div>
        <div v-else>내 글</div>
      </b-card-text>
      <b-card-text>
        <div class="small">
          작성 시간 : {{ review.created_at.substring(0, 10) }} {{ review.created_at.substring(11, 19) }}
        </div>
        <div class="small">
          수정 시간 : {{ review.updated_at.substring(0, 10) }} {{ review.updated_at.substring(11, 19) }}
        </div>
      </b-card-text>
      <router-link v-if="review.movie" :to="{ name: 'MovieDetail', params: { movie_pk: review.movie }}" class="text-decoration-none">자세히</router-link>
      <router-link v-else :to="{ name: 'ArticleDetail', params: { article_pk: review.id }}" class="text-decoration-none">자세히</router-link>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const userStore = 'userStore'


export default {
  name: 'UserReviewArticleListItem',
  props: {
    review: {
      type: Object
    }
  },
  computed: {
    ...mapState(userStore, [
      'userId'
  ]),
  }
}
</script>

<style scoped>
.article-card {
  background-color: rgba(229, 229, 229, 0.281);
  border: none;
  border-radius: 10px;
}
</style>