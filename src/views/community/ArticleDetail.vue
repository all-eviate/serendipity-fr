<template>
  <div style="max-width:696px;" class="container color-snow">
    <h1 class="title">자유 게시판!</h1>
    <!-- <p>{{ id }}번째 글</p> -->
    <div class="d-flex flex-column align-items-start">
      <div style="margin-bottom: 50px;">
        <p class="fs-3">{{ content }}</p>
      </div>
      <div class="ms-auto">
        <p>작성: {{created_at.slice(0, 10)}} {{created_at.slice(11, 16)}}</p>
        <p>수정: {{updated_at.slice(0, 10)}} {{updated_at.slice(11, 16)}}</p>
      </div>
      <div class="ms-auto color-snow">
        <router-link :to="{ name: 'Profile', params: { username: username }}" class="text-decoration-none color-snow">
          <b-img 
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            style="max-width:40px; border-radius:50%;"
          ></b-img>
          {{ username }}
        </router-link>
      </div>
      <div style="width:100%;" class="d-flex justify-content-between mt-3">
        <div>
          <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#8C2016;" variant="link" class="text-decoration-none" @click="likeArticle" v-if="liked"><b-icon-heart-fill></b-icon-heart-fill> {{ liked_users_count }}</b-button>
          <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#E5E5E5;" variant="link" class="text-decoration-none" @click="likeArticle" v-else><b-icon-heart></b-icon-heart> {{ liked_users_count }}</b-button>
          <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#E5E5E5;" variant="link" class="text-decoration-none" disabled>
            <b-icon-chat-left></b-icon-chat-left> {{ comment_count }}
          </b-button>
        </div>
        <div>
          <div v-if="this.userId === this.user">
            <router-link 
              :to="{ name: 'ArticleFormUpdate' ,params: { article_pk: this.$route.params.article_pk , articleContent: this.content }}" 
              class="color-snow text-decoration-none"
              >
              <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#E5E5E5;" variant="link" class="text-decoration-none">
                <b-icon-pencil-square></b-icon-pencil-square>
              </b-button>
            </router-link>
            <b-button size="lg" style="width:80px; height:80px; border-radius:50%; color:#F22D1B;" variant="link" class="text-decoration-none" @click="deleteArticle">
              <b-icon-trash></b-icon-trash>
            </b-button>
          </div>
        </div>
      </div>
      <!-- 자신의 글만 수정, 삭제가 가능하다. -->
    </div>
    <hr>
    <h3>댓글 작성</h3>
    <div>
      <p v-if=error>{{ error }}</p>
      <div style="margin-top: 50px; margin-bottom: 30px;" class="mx-auto">
        <div class="d-flex justify-content-center">
          <b-form-textarea style="max-width:760px; width:100%; background-color:black; color:white;"
            v-model="comment_content"
            placeholder="내용을 입력하세요."
            no-resize></b-form-textarea>
          <b-button style="width:60px;" @click="createComment" variant="outline-light"><b-icon-pencil-square></b-icon-pencil-square></b-button>
        </div>
      </div>
    </div>
    <hr>
    <article-comment-list-item
      v-for="comment in list"
      :key="comment.id"
      :comment="comment"
      @delete-article-comment="deleteComment(comment.id)"
    ></article-comment-list-item>
    <infinite-loading spinner="spiral" @infinite="infiniteHandler">
      <div slot="no-more">끝! :) <br> <b-button variant="link" @click="toTop" class="text-decoration-none color-snow mb-5">TO TOP</b-button></div>
      <div slot="no-results">No results :(</div>
      <div slot="error">첫 리뷰를 남겨주세요!</div>
    </infinite-loading>
  </div>
</template>

<script>
import axios from 'axios'
import ArticleCommentListItem from '@/components/community/ArticleCommentListItem.vue'
import InfiniteLoading from 'vue-infinite-loading'
import { mapState } from 'vuex'
const userStore = 'userStore'

export default {
  name: 'ArticleDetail',
  components: { 
    ArticleCommentListItem,
    InfiniteLoading,
  },
  data: function () {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      id: '',
      content: '',
      created_at: '',
      updated_at: '',
      user: '',
      username: '',
      liked: false,
      liked_users_count: '',
      profile_path: '',
      comment_list : '',
      comment_count : '',
      
      comment_content: '',

      list: [],
      page: 1,

      error: null,
    }
  },
  methods: {
    infiniteHandler($state) {
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}/comments/?page=${this.page}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(({data}) => {
          if (data.length) {
            this.page += 1
            this.list.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch(({response}) => {
          if (response.status === 404) {
            $state.error()
          }
        })
    },
    getArticle: function() {
      // console.log(this.$store.state.userStore.authorized_token)
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/community/${this.$route.params.article_pk}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          console.log(res)
          this.id = res.data.serializer.id,
          this.content = res.data.serializer.content,
          this.created_at = res.data.serializer.created_at.substring(0, res.data.serializer.created_at.indexOf('.')), // 시간 출력 안함,
          this.updated_at = res.data.serializer.updated_at.substring(0, res.data.serializer.updated_at.indexOf('.')), // 시간 출력 안함,
          this.user = res.data.serializer.user,
          this.username = res.data.username,
          this.liked_users_count = res.data.serializer.liked_users.length,
          this.comment_list = res.data.serializer.article_comment_set
          this.comment_count = res.data.serializer.article_comment_count
          if (this.liked_users_count > 0) {
            this.liked = res.data.serializer.liked_users.includes(this.userId)
          }
        })
        .then(() => {
          axios({
            method: 'get',
            url: `${this.SERVER_URL}/accounts/${this.username}/`,
            headers: this.$store.state.userStore.authorized_token,
          })
            .then(({data}) => {
              this.profile_path = data.user.profile_path
            })
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    likeArticle: function () {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/community/${this.id}/like/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.liked = res.data.liked
          this.liked_users_count = res.data.liked_users_count
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    deleteArticle: function () {
      axios({
        method: 'delete',
        url: `${this.SERVER_URL}/community/${this.id}/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(() => {
          this.$router.push({name : 'ArticleList'})
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    createComment(event) {
        event.preventDefault()
        const SERVER_URL = process.env.VUE_APP_SERVER_URL
        axios({
          method: 'post',
          url: `${SERVER_URL}/community/${this.id}/comments/`,
          headers: this.$store.state.userStore.authorized_token,
          data: {
            'content': this.comment_content,
            'user': this.$store.state.userStore.userId
          }
        })
          .then(({data}) => {
            this.list.push(data)
            // this.$router.go()
            this.comment_count += 1
            this.comment_content = ''
          })
          .catch(err => {
            const error = JSON.parse(err.response.request.response)
            this.error = Object.values(error)[0][0]
            console.log(this.error)
          })
      },
    updateComment(event) {
        event.preventDefault()
        const SERVER_URL = process.env.VUE_APP_SERVER_URL
        axios({
          method: 'post',
          url: `${SERVER_URL}/community/${this.id}/comments/`,
          headers: this.$store.state.userStore.authorized_token,
          data: {
            'content': this.comment_content,
            'user': this.$store.state.userStore.userId
          }
        })
          .then(() => {
            // 댓글을 작성하면 로드
            this.$router.go()
            this.comment_content = ''
          })
          .catch(err => {
            const error = JSON.parse(err.response.request.response)
            this.error = Object.values(error)[0][0]
            console.log(this.error)
          })
    },
    deleteComment(id) {
      this.list = this.list.filter(comment => comment.id !== id)
    },
    goProfile: function() {
      this.$router.push({name: 'Profile', params: { username: this.username }})
    },
    toTop: function() {
      window.scrollTo(0, 0)
    }
  },
  created: function() {
    this.getArticle()
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