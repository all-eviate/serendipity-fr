<template>
  <div id="Profile">
    <div>
      <img alt="Profile Background" src="@/assets/profile_img/profile_background.jpg" class="background-image">
    </div>
    <div class="container">
      <div id=profile class="front color-snow mx-auto mb-5 px-4">
        <div class="pt-4 pb-3">
          <h1>
            {{ profile_username }}
          </h1>
        </div>

        <!-- 프로필 이미지 -->

        <div>
          <b-img 
            :src="require(`@/assets/profile_img/${profile_path}.png`)" 
            alt="프로필 이미지"
            rounded
            style="max-width: 90%"
          ></b-img>
          <div v-if="this.username === this.profile_username" class="py-2">
            <b-button v-b-modal.modalProfile variant="dark" size="sm">프로필 이미지 바꾸기</b-button>
          </div>
          <b-modal 
            id="modalProfile" 
            title="프로필 사진을 고르세요"
            size="lg"
            hide-header-close
            hide-footer
            >
            <b-row align-h="around">
              <b-col cols=5 lg=3 v-for="(i, img_num) in 8" :key="img_num">
                <b-img thumbnail fluid :src="require(`@/assets/profile_img/${img_num}.png`)" alt="Image" @click="setProfileImg(img_num); $bvModal.hide('modalProfile');"></b-img>
              </b-col>
            </b-row>
          </b-modal>
        </div>
        <div class="my-2"> 가입한 날 : {{ date_joined }}</div>

        <!-- 팔로우 -->

        <div class="mt-2 mb-4">
          <div v-if="this.username !== this.profile_username">
            <b-button @click="follow" v-if="is_followed" variant="danger"><b-icon-person-check></b-icon-person-check></b-button>
            <b-button @click="follow" v-else variant="outline-primary"><b-icon-person-plus-fill></b-icon-person-plus-fill></b-button>
          </div>
          <div>
            <div>
              <span class="mx-2">팔로잉 : {{ followings_count }} / 팔로워 : {{ followers_count }}</span>
              <b-button v-b-modal.modalFollowList variant="dark" size="sm">목록 보기</b-button>
            </div>
            <b-modal id="modalFollowList" scrollable size="lg" hide-header>
              <b-container fluid class="color-night">
                <b-row class="mb-1">
                  <b-col>
                    <h2 class="text-center" >팔로워</h2>
                    <b-list-group v-if="followers_count">
                      <b-list-group-item v-for="follower in followers_info" :key="follower.index">
                        <router-link :to="{ name: 'Profile', params: { username: follower.username }}" :key="$route.path"
                          class="text-decoration-none"
                          >
                          <b-avatar variant="info" :src="require(`@/assets/profile_img/${follower.profile_path}.png`)" class="mr-3"></b-avatar>
                          <span class="ms-3 color-night">{{ follower.username }}</span>
                        </router-link>
                      </b-list-group-item>
                    </b-list-group>
                    <p v-else class="text-center pt-3">No Followers</p>
                  </b-col>
                  <b-col>
                    <h2 class="text-center">팔로잉</h2>
                    <b-list-group v-if="followings_count">
                      <b-list-group-item  v-for="following in followings_info" :key="following.index">
                        <router-link :to="{ name: 'Profile', params: { username: following.username }}" :key="$route.path"
                          class="text-decoration-none"
                          >
                            <b-avatar variant="info" :src="require(`@/assets/profile_img/${following.profile_path}.png`)" class="mr-3"></b-avatar>
                            <span class="ms-3 color-night">{{ following.username }}</span>
                        </router-link>
                      </b-list-group-item>
                    </b-list-group>
                    <p v-else class="text-center pt-3">No Followings</p>
                  </b-col>
                </b-row>
              </b-container>
            </b-modal>
          </div>
        </div>
        
        <!-- 숫자로 보여주는 구간 -->
        <b-row class="my-5">

          <!-- 영화 -->

          <b-col cols="12" sm>
            <h4>좋아하는 영화</h4>
            <router-link :to="{ name: 'UserLikedMovieList', params: { username: profile_username, type: 'like' }}" class="color-snow text-decoration-none">
              <h4>
                {{ liked_movies_count }}
              </h4>
            </router-link>
          </b-col>
          <b-col cols="12" sm>
            <h4>보고싶은 영화</h4>
            <router-link :to="{ name: 'UserWishedMovieList', params: { username: profile_username, type: 'wish' }}" class="color-snow text-decoration-none">
              <h4>
                {{ wished_movies_count }}
              </h4>
            </router-link>
          </b-col>

          <!-- 영화 리뷰 -->

          <b-col cols="12" sm>
            <h4>작성한 영화 리뷰</h4>
            <router-link :to="{ name: 'UserWroteReviewList', params: { username: profile_username, type: 'wrote_reviews' }}" class="color-snow text-decoration-none">
              <h4>
                {{ review_count }}
              </h4>
            </router-link>
          </b-col>
          <b-col cols="12" sm>
            <h4>좋아하는 영화 리뷰</h4>
            <router-link :to="{ name: 'UserLikedReviewList', params: { username: profile_username, type: 'liked_reviews' }}" class="color-snow text-decoration-none">
              <h4>
                {{ liked_reviews_count }}
              </h4>
            </router-link>
          </b-col>
        </b-row>


        <!-- 테이블로 보여주는 구간 -->
        <div>
          <!-- 게시글 -->
          <div class="pb-5">
            <div class="d-flex justify-content-center">
              <h2 class="pe-2 mb-0 align-middle">작성한 게시글</h2>
              <router-link :to="{ name: 'UserWroteArticleList', params: { username: profile_username, type: 'wrote_articles'}}" class="color-snow text-decoration-none">
                <b-button variant="dark" size="sm">더보기</b-button>
              </router-link>
            </div>
            <p class="text-muted">최근 작성한 게시글 중 5개 입니다.</p>
            <div>
              <b-table stripted :items="article_set" :fields="fields">
                <template #cell(created_at)="data">
                  {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }}  
                </template>
                <template #cell(updated_at)="data">
                  {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }}  
                </template>
                <template #cell(liked_users)="data">
                  {{ data.value.length }} 
                </template>
              </b-table>
            </div>
          </div>
          <div class="pb-5">
            <div class="d-flex justify-content-center">
              <h2 class="pe-2 mb-0 align-middle">좋아요한 게시글</h2>
              <router-link :to="{ name: 'UserLikedArticleList', params: { username: profile_username, type: 'liked_articles'}}" class="color-snow text-decoration-none">
                <b-button variant="dark" size="sm">더보기</b-button>
              </router-link>
            </div>
            <p class="text-muted">최근 좋아요한 게시글 5개 입니다.</p>
            <div>
              <b-table stripted :items="liked_articles" :fields="fields" class="color-snow">
                <template #cell(created_at)="data">
                  {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }} 
                </template>
                <template #cell(updated_at)="data">
                  {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }} 
                </template>
                <template #cell(liked_users)="data">
                  {{ data.value.length }} 
                </template>
              </b-table>
            </div>
          </div>
          <div class="pb-5">
            <h2>작성한 영화 리뷰 댓글</h2>
            <p class="text-muted">최근 작성한 리뷰 댓글 5개 입니다.</p>
            <b-table stripted :items="review_comment_set" :fields="fields" class="color-snow">
              <template #cell(created_at)="data">
                {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }} 
              </template>
              <template #cell(updated_at)="data">
                {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }} 
              </template>
              <template #cell(liked_users)="data">
                {{ data.value.length }} 
              </template>
            </b-table>
          </div>
          <div class="pb-5">
            <h2>작성한 게시글 댓글</h2>
            <p class="text-muted">최근 작성한 댓글 5개 입니다.</p>
            <b-table stripted :items="article_comment_set" :fields="fields" class="color-snow">
              <template #cell(created_at)="data">
                {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }}  
              </template>
              <template #cell(updated_at)="data">
                {{ data.value.substring(0, 10) }} {{ data.value.substring(11, 19) }}  
              </template>
              <template #cell(liked_users)="data">
                {{ data.value.length }} 
              </template>
            </b-table>
          </div>
        </div>


        <!-- 회원정보 수정 -->

        <div v-if="this.username === this.profile_username">
          <div class="py-3">
            <router-link :to="{ name: 'UpdateUser' ,params: { username: this.username }}" class="color-snow text-decoration-none">
              <b-button variant="outline-light">회원 정보 수정</b-button>
            </router-link>
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
  name: 'Profile',
  data: function () {
    return {
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      // 사용자 정보
      profile_username: '',
      profile_path: '0',
      date_joined: null,

      // 사용자 팔로잉 팔로워 카운트
      followers: [],
      followers_info: [],
      followings: [],
      followings_info: [],
      followers_count: -1,
      followings_count: -1,
      is_followed: false,

      // 사용자의 영화, 리뷰, 게시글 정보
      liked_movies_count: -1,
      wished_movies_count: -1,
      
      review_count: [],
      review_comment_set: [],

      liked_reviews_count: -1,
      
      article_set: [],
      article_comment_set: [],

      liked_articles: [],

      // 테이블 필드 커스텀
      fields: [
        { key: 'content', label: '내용', thClass: 'contentTable' },
        { key: 'created_at', label: '작성 시간', thClass: 'dateTable d-none d-sm-table-cell', tdClass: 'dateTable d-none d-sm-table-cell'},
        { key: 'updated_at', label: '수정 시간', thClass: 'dateTable d-none d-sm-table-cell', tdClass: 'dateTable d-none d-sm-table-cell' },
        { key: 'liked_users', label: '좋아요 수', thClass: 'likeTable' },
      ],
    }
  },
  methods: {
    getUser: function() {
      axios({
        method: 'get',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.profile_username = res.data.user.username
          this.profile_path = res.data.user.profile_path
          this.date_joined = res.data.user.date_joined.substring(0, res.data.user.date_joined.indexOf('T')) // 시간 출력 안함
          
          // 팔로잉 관련
          this.followings = res.data.user.followings
          this.followers = res.data.user.followers
          this.followings_count = res.data.user.followings.length
          this.followers_count = res.data.user.followers.length
          this.followers_info = res.data.followers_info
          this.followings_info = res.data.followings_info
          
          if (this.followers_count) {
            this.is_followed = res.data.user.followers.includes(this.userId)
          }

          // 영화 관련
          this.liked_movies_count = res.data.user.liked_movies_count
          this.wished_movies_count = res.data.user.wished_movies_count

          // 영화 리뷰 관련
          this.review_count = res.data.user.review_count
          this.review_comment_set = res.data.user.review_comment_set.slice(-5).reverse()
          this.liked_reviews_count = res.data.user.liked_reviews_count
          // this.liked_review_comments = res.data.user.liked_review_comments

          // 게시글 관련
          this.article_set = res.data.user.article_set.slice(-5).reverse()
          this.article_comment_set = res.data.user.article_comment_set.slice(-5).reverse()
          this.liked_articles = res.data.user.liked_articles.slice(-5).reverse()
          // this.liked_article_comments = res.data.user.liked_article_comments
        })
        .catch(err => {
          console.log(err)
          if (err.response.status === 404) {
            this.$router.push({name:'404'})
          }
        })
    },
    follow: function() {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}/follow/`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(res => {
          this.is_followed = res.data.is_followed
          this.followers_count = res.data.followers_count
          this.followings_count = res.data.followings_count
          this.followers_info = res.data.followers_info
          this.followings_info = res.data.followings_info
        })
        .catch(err => {
          console.log(err)
        })
    },
    setProfileImg: function (img_num) {
      axios({
        method: 'put',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}/profileImg/`,
        headers: this.$store.state.userStore.authorized_token,
        data: {
          newProfileImg: img_num
        }
      })
        .then(res => {
          this.profile_path = res.data.new_profile_path
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  },
  created: function () {
    // 유저 정보를 profile 페이지 만들자마자 가져오기
    this.getUser()
  },
  computed: {
    // 전역으로 사용하는 현재 로그인한 유저 정보
    ...mapState(userStore, [
      'userId',
      'username'
    ]),
  },
  mounted () {
    // 프로필 페이지가면 위로 올라가도록
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>

/* scrollable은 중간으로 잘 감 */
.modal-dialog-scrollable > .modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
}
/* 아닌 애들은 직접 움직임 */
#modalDeleteUser > .modal-dialog, #modalProfile > .modal-dialog {
  margin-top: 100px;
}
/* 가로 크기가 안맞아서.. */
#modalProfile .modal-content {
  margin-left:auto;
  margin-right: auto;
  max-width: 80%;
}
/* 뒤 배경 사이즈 강제 */
#modalDeleteUser___BV_modal_backdrop_, #modalProfile___BV_modal_backdrop_, #modalFollowList___BV_modal_backdrop_ {
  width: 100%;
  height: 100%;
}
/* 프로필 박스 관련 */
.front {
  background-color: rgba(255, 255, 255, 0.205);
  border-radius: 20px;
  word-break: break-all;
}
.btn-dark, .table {
  color: #E5E5E5;
}

</style>

<style>
.contentTable {
  width: 40%;
}
.dateTable {
  width: 20%;
}
.likeTable {
  width: 20%;
}
@media (max-width: 576px) {
  .contentTable {
    width: 60%;
  }
  .dateTable {
    width: 0%;
  }
  .linkTable {
    width: 40%;
  }
}
</style>