<template>
  <div>
    <!-- 배경 이미지 -->
    <div class="background-image"
      :style="{ 'background-image': 'url('+`${main_img_str}`+ ')' }">
      <div class="transparent-black"></div>
    </div>
    <!-- 회원가입 박스 -->
    <div class="container">
      <b-card class="main" 
        >
        <h1 class="color-snow">Welcome🎬</h1>
        <div style="font-size: 12px;">사용자 이름은 알파벳, 숫자만 가능합니다.</div>
        <div style="font-size: 12px;">비밀번호는 문자, 숫자, 특수문자를 합해 8자리 이상이어야 합니다.</div>
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
          ></b-form-input>
          <b-form-input
            class="input-form"
            v-model="credentials.passwordConfirmation"
            type="password"
            placeholder="비밀번호 확인"
            required
            style="color: #E5E5E5;"
            @keyup.enter="checkId(credentials.username, credentials.password, credentials.passwordConfirmation)"
          ></b-form-input>
          <b-button @click="checkId(credentials.username, credentials.password, credentials.passwordConfirmation)" style="color: #E5E5E5;">회원 가입</b-button>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Signup',
  data: function () {
    return {
      credentials: {
        username: null,
        password: null,
        passwordConfirmation: null,
      },
      error: null,
      SERVER_URL: process.env.VUE_APP_SERVER_URL,
      invalid_names: ['login', 'signup', 'admin', 'id', 'password', ''],
      main_img_str: `${require('@/assets/main_img/'+String(_.random(2))+'.jpg')}`,
    }
  },
  methods: {
    checkId: function(id, ps, psconfirm) {
      const alphabets = /^[a-zA-Z0-9._]*$/
      const onlynum = /^[0-9]+$/
      if ( this.invalid_names.includes(id)  || !id.match(alphabets) || (id.match(onlynum) != null)) {
        this.error = '불가능한 사용자 이름입니다.'
        return
      }
      else if ( id.length < 5 ) {
        this.error = '아이디가 너무 짧습니다. 5글자 이상으로 작성해주세요.'
      } 
      else {
        this.checkPassword(ps, psconfirm)
      }
    },
    checkPassword: function (ps, psconfirm) {
      let strength=0;
      if (!ps.match(/[a-z]+/) || !psconfirm.match(/[a-z]+/)){
        this.error = "비밀번호에 문자가 없습니다."
        strength-=1;
      }
      if (!ps.match(/[0-9]+/) || !psconfirm.match(/[0-9]+/)){
        this.error = "비밀번호에 숫자가 없습니다."
        strength-=1;
      }
      if (!ps.match(/[$@#&!]+/) || !psconfirm.match(/[$@#&!]+/)){
        this.error = "비밀번호에 특수 문자가 없습니다."
        strength-=1;
      }
      if (ps.length < 8 || psconfirm.length < 8){
        this.error = "비밀번호는 최소 8자리 입니다."
        strength-=1;
      }
      if (strength > -1) {
        this.signup()
      }
    },
    signup: function () {
      axios({
        method: 'post',
        url: `${this.SERVER_URL}/accounts/signup/`,
        data: this.credentials
      })
        .then(() => {
          // 회원가입하면 로그인 페이지로 이동
          this.$router.push({name : 'Login'})
        })
        .catch(err => {
          // console.log(err.response)
          const error = JSON.parse(err.response.request.response)
          this.error = Object.values(error)[0][0]
          // console.log(this.error)
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