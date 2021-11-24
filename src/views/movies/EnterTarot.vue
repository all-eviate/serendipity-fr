<template>
  <div>
    <div class="bg"
      :style="{ 'background-image': 'url(' + `${require('@/assets/tarot_background.jpg')}`  + ')' }">
    </div>
    <div class="viewport">
      <div class="tarot-title"
        v-animate-css="'fadeIn'"
        v-animate-css.click="'fadeOutUp'"
        v-if="showWelcomeText"
        @click="hideWelcome"
        >당신은 운이 좋은 사람인가요?</div>
        <div class="tarot-title"
        v-animate-css.once="animationFadeIn"
        v-animate-css.click="'fadeOutUp'"
        v-if="showInformText"
        @click="hideInform"
        >당신을 위한 특별한 영화 명대사 하나를 드릴게요</div>
        <div 
        id ="fontItalic"
        class="tarot-title px-5 color-snow"
        v-if="showResultText"
        v-animate-css.once="animationFadeIn"
        @click="goTarotPage"
        > {{ quotes }}</div>
      <vue-particles
        color="#dedede"
        style="height: 100%;"
        ></vue-particles>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnterTarot",
  data: function() {
    return {
      quotes: '',
      showWelcomeText: true,
      showInformText: false,
      showResultText: false,
      animationFadeIn: {
        classes: 'fadeIn',
        delay: 1000,
        iteration: 1,
      },
    }
  },
  methods: {
    hideWelcome: function() {
      setTimeout(() => {
        this.showWelcomeText = false;
      }, 1000)
      this.showInform()
    },
    showInform: function() {
      this.showInformText = true;
    },
    hideInform: function() {
      setTimeout(() => {
        this.showInformText = false;
      }, 1000)
      this.showResult()
    },
    showResult: function () {
      const movieQutes = require('movie-quotes');
      let result = movieQutes.random();
      const result_parse_idx = result.lastIndexOf('" ')
      const result_quotes = result.slice(0, result_parse_idx + 1)
      const result_movie = result.slice(result_parse_idx + 2)
      this.quotes = result_quotes.concat(' - ', result_movie);
      this.showResultText = true;
    },
    goTarotPage: function () {
      this.$router.push({ name: "TarotCard"})
    }
  },
}
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100vh;
    z-index:-1;
    filter: blur(4px);
    position: absolute;
    top: 0px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  #fontItalic {
    font-family: Nanum Myeongjo, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    font-style: italic;
  }
  .viewport {
    margin-left: auto;
    margin-right: auto;
    width: 100vw;
    height: calc(100vh - 66px);
  }

  .tarot-title {
    width: 100%;
    position: absolute;
    top: 40%;
    color: #E5E5E5;
    text-align: center;
    vertical-align: middle;
    font-size: 2rem;
  }
</style>