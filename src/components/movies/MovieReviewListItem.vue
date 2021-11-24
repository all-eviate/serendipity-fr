<template>
  <!-- 한무 스크롤 -->
  <div style="max-width:800px; border-radius:10px;" class="bg-color-snow p-3 mx-auto mb-2">
    <div class="d-flex container">
      <div>
        <router-link :to="{ name: 'Profile', params: { username: movieReview.username }}">
          <b-img 
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            style="max-width:75px; border-radius:50%;"
          ></b-img>
        </router-link>
      </div>
      <div class="d-flex flex-column mb-2" style="width:100%;">
        <div class="d-flex justify-content-between" style="text-align:left; padding-left:30px;">
          <router-link :to="{ name: 'Profile', params: { username: movieReview.username }}" class="text-decoration-none text-dark">
            {{movieReview.username}}
          </router-link>
          <div>
            {{movieReview.created_at.slice(0, 10)}} {{movieReview.created_at.slice(11, 16)}}
          </div>
        </div>
        <div style="margin-left:30px; text-align: left;">
          <b-form-textarea
            v-if="nowedit"
            v-model="content"
            rows="1"
            no-resize></b-form-textarea>
          <div v-else class="mt-2">
            {{ content }}
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <b-button size="sm" class="text-decoration-none" style="width:50px; height:50px; border-radius:50%; color:#8C2016;" variant="link" @click="likeReview" v-if="likedReview"><b-icon-heart-fill></b-icon-heart-fill> {{likedUsersCount}}</b-button>
          <b-button size="sm" class="text-decoration-none text-dark" style="width:50px; height:50px; border-radius:50%;" variant="link" @click="likeReview" v-else><b-icon-heart></b-icon-heart> {{likedUsersCount}}</b-button>
          <b-button size="sm" class="text-decoration-none text-dark" style="width:50px; height:50px; border-radius:50%;" v-if="toggled" v-b-toggle="`collapse-${movieReview.id}`" variant="link" @click="toggle"><b-icon-chat-left-text></b-icon-chat-left-text> {{ comment_count }}</b-button>
          <b-button size="sm" class="text-decoration-none text-dark" style="width:50px; height:50px; border-radius:50%;" v-else v-b-toggle="`collapse-${movieReview.id}`" variant="link" @click="toggle"><b-icon-caret-up-fill></b-icon-caret-up-fill></b-button>
          <div v-if="this.userId === movieReview.user">
            <b-button size="sm" class="text-decoration-none" style="width:50px; height:50px; border-radius:50%; color:#F22D1B;" variant="link" @click="deleteReview" v-show="nowedit"><b-icon-trash></b-icon-trash></b-button>
            <b-button size="sm" class="text-decoration-none text-dark" style="width:50px; height:50px; border-radius:50%;" variant="link" @click="updateReview" v-if="nowedit"><b-icon-check-square></b-icon-check-square></b-button>
            <b-button size="sm" class="text-decoration-none text-dark" style="width:50px; height:50px; border-radius:50%;" variant="link" @click="editReview" v-else><b-icon-pencil-square></b-icon-pencil-square></b-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div>
        <b-collapse :id="`collapse-${movieReview.id}`" class="mt-2">
          <div class="bg-color-snow">
            <p class="card-text">
              <movie-review-comment-list
                :reviewPk="String(movieReview.id)"
                @create-review-comment="createReviewComment"
                @delete-review-comment="deleteReviewComment"></movie-review-comment-list>
            </p>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import MovieReviewCommentList from './MovieReviewCommentList.vue'

const userStore = 'userStore'

export default {
  components: {
    MovieReviewCommentList,

  },
  name: "MovieReviewListItem",
  props: {
    movieReview: {
      type: Object,
    }
  },
  data: function() {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      likedUsersCount: this.movieReview.liked_users_count,
      content: '',
      fixedContent: '',
      nowedit: false,
      likedReview: false,
      toggled: true,
      profile_path: '',
      comment_count: this.movieReview.review_comment_set.length,
    }
  },
  methods: {
    toggle: function() {
      this.toggled = !this.toggled
    },
    editReview: function() {
      this.fixedContent = this.content
      this.nowedit = !this.nowedit
    },
    updateReview: function() {
      this.nowedit = !this.nowedit
      if (this.fixedContent === this.content) {
        return null
      }
      else {
        axios({
          method: 'put',
          url: `${this.SERVER_URL}/movies/${this.$route.params.movie_pk}/review/${this.movieReview.id}/`,
          headers: this.$store.state.userStore.authorized_token,
          data: {
            'content': this.content,
            'user': this.$store.state.userStore.userId
          }
        })
          .catch(err => {
            if (err.response.status === 400) {
              this.content = this.fixedContent
            }
          })
      }
    },
    createReviewComment: function() {
      this.comment_count += 1
    },
    deleteReviewComment: function() {
      this.comment_count -= 1
    },
    deleteReview: function() {
      axios({
        method: 'delete',
        url: `${this.SERVER_URL}/movies/${this.$route.params.movie_pk}/review/${this.movieReview.id}/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(() => {
          this.$emit("delete-review")
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    likeReview: function() {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/movies/${this.$route.params.movie_pk}/review/${this.movieReview.id}/like/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.likedReview = res.data.liked
          this.likedUsersCount = res.data.likers
        })
    }
  },
  created: function() {
    this.content = this.movieReview.content
    this.likedReview = this.movieReview.liked_users.includes(this.userId)
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/accounts/${this.movieReview.username}/`,
      headers: this.$store.state.userStore.authorized_token,
    })
      .then(({data}) => {
        this.profile_path = data.user.profile_path
      })
  },
  computed: {
    ...mapState(userStore, [
      'userId'
    ]),
  }
}
</script>

<style>

</style>