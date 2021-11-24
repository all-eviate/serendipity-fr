<template>
  <div class="mb-2">
    <div class="d-flex container">
      <div>
        <router-link :to="{ name: 'Profile', params: { username: comment.username }}">
          <b-img
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            style="max-width:50px; border-radius:50%;"
          ></b-img>
        </router-link>
      </div>
      <div class="d-flex flex-column" style="width:100%;">
        <div class="d-flex justify-content-between" style="text-align:left; padding-left:30px;">
          <router-link :to="{ name: 'Profile', params: { username: comment.username }}" class="text-decoration-none">
            {{comment.username}}
          </router-link>
          <div>
            {{comment.created_at.slice(0, 10)}} {{comment.created_at.slice(11, 16)}}
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
          <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color: #8C2016" class="text-decoration-none" @click="likeArticleComment" v-if="likedComment"><b-icon-heart-fill></b-icon-heart-fill> {{likedComment_users_count}}</b-button>
          <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="likeArticleComment" v-else><b-icon-heart></b-icon-heart> {{likedComment_users_count}}</b-button>
          <div v-if="this.userId === comment.user">
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="updateArticleComment" v-if="nowedit"><b-icon-check-square></b-icon-check-square></b-button>
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color: #E5E5E5" class="text-decoration-none" @click="editArticleComment" v-else><b-icon-pencil-square></b-icon-pencil-square></b-button>
            <b-button size="sm" variant="link" style="width:50px; height:50px; border-radius:50%; color:#F22D1B;" class="text-decoration-none" @click="deleteArticleComment"><b-icon-trash></b-icon-trash></b-button>
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
  name: 'ArticleCommentListItem',
  props: {
    comment: {
      type: Object,
    }
  },
  data: function() {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      likedComment_users_count: this.comment.comment_liked_users_count,
      like_users: null,
      likedComment: false,
      nowedit: false,
      content: '',
      profile_path: '',
    }
  },
  methods: {
    likeArticleComment: function () {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/comments/${this.comment.id}/like/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.likedComment = res.data.likedComment
          this.likedComment_users_count = res.data.likedComment_users_count
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    deleteArticleComment: function () {
      axios({
        method: 'delete',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/comments/${this.comment.id}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(() => {
          this.$emit('delete-article-comment')
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    editArticleComment: function() {
      this.nowedit = !this.nowedit
    },
    updateArticleComment: function() {
      this.nowedit = !this.nowedit
      axios({
        method: 'put',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/comments/${this.comment.id}/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          'content': this.content,
          'user': this.$store.state.userStore.userId
        }
      })
        .catch(err => {
          console.log(err.response)
        })
    },
  },
  created: function() {
    this.content = this.comment.content
    this.likedComment = this.comment.liked_users.includes(this.userId)
    axios({
      method: 'get',
      url: `${this.SERVER_URL}/accounts/${this.comment.username}/`,
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
  },
}
</script>

<style>

</style>