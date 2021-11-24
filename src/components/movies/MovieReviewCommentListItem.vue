<template>
  <!-- 페이지네이터 / 더보기로 로딩 -->
  <div>
    <div class="d-flex container" style="padding-left:50px;">
      <div>
        <router-link :to="{ name: 'Profile', params: { username: movieReviewComment.username }}">
          <b-img
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            style="max-width:50px; border-radius:50%;"
          ></b-img>
        </router-link>
      </div>
      <div class="d-flex flex-column" style="width:100%;">
        <div class="d-flex justify-content-between" style="text-align:left; padding-left:30px;">
          <router-link :to="{ name: 'Profile', params: { username: movieReviewComment.username }}" class="text-decoration-none text-dark">
            {{movieReviewComment.username}}
          </router-link>
          <div>
            {{movieReviewComment.created_at.slice(0, 10)}} {{movieReviewComment.created_at.slice(11, 16)}}
          </div>
        </div>
        <div style="padding-left:30px;">
          <b-form-textarea
            text
            v-if="nowedit"
            v-model="content"
            rows="1"
            no-resize></b-form-textarea>
          <div v-else style="text-align: left;">
            {{ content }}
          </div>
        </div>
        <div class="d-flex" style="padding-left:30px;">
          <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color: #8C2016" class="text-decoration-none" @click="likeReviewComment" v-if="likedReviewComment"><b-icon-heart-fill></b-icon-heart-fill> {{likedUsersCount}}</b-button>
          <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%;" class="text-decoration-none text-dark" @click="likeReviewComment" v-else><b-icon-heart></b-icon-heart> {{likedUsersCount}}</b-button>
          <div v-if="this.userId === movieReviewComment.user">
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%;" class="text-decoration-none text-dark" @click="updateReviewComment" v-if="nowedit"><b-icon-check-square></b-icon-check-square></b-button>
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%;" class="text-decoration-none text-dark" @click="editReviewComment" v-else><b-icon-pencil-square></b-icon-pencil-square></b-button>
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color:#F22D1B;" class="text-decoration-none" @click="deleteReviewComment"><b-icon-trash></b-icon-trash></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

const userStore = 'userStore'

export default {
  name: "MovieReviewCommentListItem",
  props: {
    movieReviewComment: {
      type: Object,
    }
  },
  data: function() {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      likedUsersCount: this.movieReviewComment.liked_users_count,
      content: '',
      fixedContent: '',
      nowedit: false,
      likedReviewComment: false,
      profile_path: '',
    }
  },
  methods: {
    editReviewComment: function() {
      this.fixedContent = this.content
      this.nowedit = !this.nowedit
    },
    updateReviewComment: function() {
      this.nowedit = !this.nowedit
      if (this.fixedContent === this.content) {
        return null
      }
      else {
        axios({
          method: 'put',
          url: `${this.SERVER_URL}/movies/${this.movieReviewComment.review}/comment/${this.movieReviewComment.id}/`,
          headers: this.$store.state.userStore.authorized_token,
          data: {
            'content': this.content,
            'user': this.$store.state.userStore.userId
          }
        })
          .catch(err => {
            if (err.response.status === 400) {
              this.content = this.fixedContent
            } else if (err.response.status === 404) {
              console.log("설마 여기서 404 에러가 뜨겠어?")
            }
          })
      }
    },
    deleteReviewComment: function() {
      axios({
        method: 'delete',
        url: `${this.SERVER_URL}/movies/${this.movieReviewComment.review}/comment/${this.movieReviewComment.id}/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(() => {
          this.$emit("delete-review-comment")
        })
        .catch(err => {
          if (err.response.status === 404) {
            console.log("이미 삭제된 리뷰입니다.")
          }
        })
    },
    likeReviewComment: function() {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/movies/${this.movieReviewComment.review}/comment/${this.movieReviewComment.id}/like/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.likedReviewComment = res.data.liked
          this.likedUsersCount = res.data.likers
        })
        .catch(err => {
          if (err.response.status === 404) {
            console.log("삭제된 리뷰글입니다.")
          }
        })
    }
  },
  created: function() {
    this.content = this.movieReviewComment.content
    this.likedReviewComment = this.movieReviewComment.liked_users.includes(this.userId)
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/accounts/${this.movieReviewComment.username}/`,
      headers: this.$store.state.userStore.authorized_token,
    })
      .then(({data}) => {
        this.profile_path = data.user.profile_path
      })
  },
  computed: {
    ...mapState(userStore, [
      'userId'
    ])
  }
}
</script>

<style>

</style>