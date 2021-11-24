<template>
  <div>
    <!-- 배경 이미지 -->
    <div class="background-image"
      :style="{ 'background-image': 'url('+`${main_img_str}`+ ')' }">
      <div class="transparent-black"></div>
    </div>
    <!-- 로그인 박스 -->
    <div class="container">
      <b-card class="main" 
        >
        <h1 class="color-snow">로그인</h1>
        <div class="input-container mx-auto">
          <b-alert v-if=error show variant="danger">{{ error }}</b-alert>
          <b-form-input
            class="input-form"
            v-model="credentials.username"
            type="text"
            placeholder="사용자 이름"
            required
            autofocus
            style="color: #E5E5E5;"
          ></b-form-input>
          <b-form-input
            class="input-form"
            v-model="credentials.password"
            type="password"
            placeholder="비밀번호"
            required
            style="color: #E5E5E5;"
            @keyup.enter="login"
          ></b-form-input>
          <b-button @click="login" style="color: #E5E5E5;">로그인</b-button>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Login',
  data: function () {
    return {
      credentials: {
        username: null,
        password: null,
      },
      error: null,
      main_img_str: `${require('@/assets/main_img/'+String(_.random(2))+'.jpg')}`,
    }
  },
  methods: {
    login: function () {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'post',
        url: `${SERVER_URL}/accounts/api-token-auth/`,
        data: this.credentials,
      })
        .then(res => {
          localStorage.setItem('jwt', res.data.token)
          // vuex의 login 액션 -> LOGIN 변이 -> state의 isLogin 변경
          this.$store.dispatch('userStore/login')
          console.log(this.$router.history)
          if (this.$router.history.current.fullPath === '/accounts/login' && this.$router.history._startLocation === '/accounts/signup') {
            this.$router.push({ name: 'Home'})
          } 
          else if (this.$router.history.current.fullPath === '/accounts/login' && this.$router.history._startLocation === '/') {
            this.$router.push({ name: 'Home'})
          }
          else {
            this.$router.go(-1)
          }
        })
        .catch(err => {
          console.log(err)
          let error_message = JSON.parse(err.response.request.response)
          try {
            if (error_message['password'][0] === 'This field may not be null.') {
              error_message = '빈 칸이 있어서는 안됩니다.'
            }
            else if (error_message['username'][0] === 'This field may not be null.') {
              error_message = '빈 칸이 있어서는 안됩니다.'
            }
          }
          catch {
            if (error_message['non_field_errors'][0] === 'Unable to log in with provided credentials.') {
              error_message = '존재하지 않는 사용자이거나, 사용자 이름 또는 비밀번호가 다릅니다.'
            }
          }
          this.error = error_message
        })
    }
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
  .btn {
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
  
  .btn:hover{
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