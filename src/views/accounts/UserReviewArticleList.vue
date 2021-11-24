<template>
  <div>
    <div>
      <img alt="Profile Background" src="@/assets/profile_img/article_background.jpg" class="background-image">
    </div>
    <div class="container color-snow">
      <div v-if="this.$route.path === `/accounts/${this.$route.params.username}/reviews/wrote_reviews`">
        <h1 class="pb-3">작성한 영화 리뷰</h1>
        <div>
          <b-row>
            <user-review-article-list-item 
              v-for="review in wrote_reviews"
              :key="review.id"
              :review="review"
              >
            </user-review-article-list-item>
          </b-row>
        </div>
      </div>
      <div v-else-if="this.$route.path === `/accounts/${this.$route.params.username}/reviews/liked_reviews`">
        <h1 class="mb-3">좋아하는 영화 리뷰</h1>
        <div>
          <b-row>
            <user-review-article-list-item 
              v-for="review in liked_reviews"
              :key="review.id"
              :review="review"
              >
            </user-review-article-list-item>
          </b-row>
        </div>
      </div>
      <div v-else-if="this.$route.path === `/accounts/${this.$route.params.username}/reviews/wrote_articles`">
        <h1>작성한 게시글</h1>
        <div>
          <user-review-article-list-item 
            v-for="review in wrote_articles"
            :key="review.id"
            :review="review"
            >
          </user-review-article-list-item>
        </div>
      </div>
      <div v-else>
        <h1>좋아요한 게시글</h1>
        <div>
          <user-review-article-list-item 
            v-for="review in liked_articles"
            :key="review.id"
            :review="review"
            >
          </user-review-article-list-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UserReviewArticleListItem from '@/components/accounts/UserReviewArticleListItem.vue'

export default {
  name: 'UserReviewList',
  components: {
    UserReviewArticleListItem
  },
  data: function () {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,

      // 사용자의 영화 정보
      wrote_reviews: [],
      liked_reviews: [],
      wrote_articles: [],
      liked_articles: [],
    }
  },
  methods: {
    getReviews: function() {
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}/reviews`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          // console.log(res)
          this.liked_reviews = res.data.liked_reviews
          this.wrote_reviews = res.data.review_set
          this.wrote_articles = res.data.article_set
          this.liked_articles = res.data.liked_articles
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
  created: function() {
    this.getReviews()
  },
  mounted () {
    // 프로필 페이지가면 위로 올라가도록
    window.scrollTo(0, 0)
  }
}
</script>

<style>

</style>