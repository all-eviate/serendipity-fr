<template>
  <div>
    <!-- 배경 이미지 -->
    <div class="background-image"
      :style="{ 'background-image': 'url('+`${main_img_str}`+ ')' }">
      <div class="transparent-black"></div>
    </div>
    <div class="container">
      <b-card class="main" 
        text-variant="light"
        >
        <h1 class="color-snow">비밀 번호 수정</h1>
        <div class="input-container mx-auto">
          <b-alert v-if=error show variant="danger">{{ error }}</b-alert>
          <h2 class="my-4 color-snow">아이디 : {{ credentials.username }}</h2>
          <b-form-input
            class="input-form color-snow"
            v-model="credentials.password"
            type="password"
            placeholder="비밀번호"
            style="color: #E5E5E5;"
            required
          ></b-form-input>
          <b-form-input
            class="input-form color-snow"
            v-model="credentials.passwordConfirmation"
            type="password"
            placeholder="비밀번호 확인"
            style="color: #E5E5E5;"
            required
          ></b-form-input>
          <b-form-input
            class="input-form color-snow"
            v-model="credentials.newPassword"
            type="password"
            placeholder="새 비밀번호"
            style="color: #E5E5E5;"
            required
            @keyup.enter="updateUser"
          ></b-form-input>
          <b-button 
            class="btn-gradient"
            @click="updateUser"
            style="color: #E5E5E5;">
            회원 정보 수정
          </b-button>
        </div>
      </b-card>
    </div>
    <b-button v-b-modal.modalDeleteUser class="mt-5 btn-color-sub">회원 탈퇴</b-button>
      <b-modal 
        id="modalDeleteUser"
        @ok="deleteUser" ok-variant="danger" ok-title="회원 탈퇴"
        hide-header
        class="mx-auto"
        >
        <p class="my-4" style="color: black; ">정말 탈퇴하시겠습니까?</p>
      </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'UserForm',
  data: function () {
    return {
      credentials: {
        username: this.$route.params.username,
        password: '',
        passwordConfirmation: '',
        newPassword: ''
      },
      error: '',
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      main_img_str: `${require('@/assets/main_img/'+String(_.random(2))+'.jpg')}`,
    }
  },
  methods: {
    updateUser: function () {
      axios({
        method: 'put',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}/`,
        headers: this.$store.state.userStore.authorized_token,
        data: this.credentials
      })
        .then(() => {
          // 비번바꾸면 프로필로 이동
          this.$router.push({name : 'Profile', params: { username: this.$route.params.username }})
        })
        .catch(err => {
          const error = JSON.parse(err.response.request.response)
          this.error = Object.values(error)[0][0]
          // console.log(this.error)
          // console.log(err.response)
        })
    },
    deleteUser: function () {
      axios({
        method: 'delete',
        url: `${this.SERVER_URL}/accounts/${this.$route.params.username}`,
        headers: this.$store.state.userStore.authorized_token,
      })
        .then(() => {
          console.log('바이!')
          // 로그아웃 처리하기
          this.$store.dispatch('userStore/logout')
          this.$router.push({name: 'Home'})
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
  created: function () {
    this.main_img_num = _.random(2)
  },
}
</script>

<style scoped>
  .main {
    background-color: rgba(0,0,0,.3);
    color: #fff;
    left: 10%;
    width: 80%;
    top: 20%;
    padding: 5px;
    padding-top: 3%;
    padding-bottom: 5%;
  }
  .card {
    margin-top: 200px;
    border: none;
  }
  .input-container{
    width: 80%;
  }
  .btn-gradient {
    width: 100%;
    /* background-color: transparent; */
    background-image: linear-gradient(-90deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #23a6d5, #e73c7e, #ee7752);
    background-repeat: repeat-x;
    background-position: -25% -100%;
    background-size: 200%;
    border: none;
    cursor: pointer;
    animation: gradient_button 10s linear infinite;
  }
  
  .btn-gradient:hover{
    animation-play-state: paused;
  }

  @keyframes gradient_button {
    from {
      background-position: left center;
    }
    to {
      background-position: 200% center;
    }
  }
  .input-form {
    margin-bottom: 20px;
    border-bottom: 1px solid #ced4da;
    border-radius: 0;
    border-top: none;
    border-right: none;
    border-left: none;
    background-color: rgba(0,0,0,0);
  }
  .input-form::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 255, 255, 0.562);
  }
  .input-form:focus {
    background: transparent;
    outline: none;
    box-shadow: none;
  }
</style>