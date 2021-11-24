<template>
  <div class="color-snow">
    <div class="bg"
      :style="{ 'background-image': 'url(' + `${backdrop_path}`  + ')' }">
    </div>
    <div>
      <h1 id ="fontItalic" style="margin-top:100px" class="mb-5 color-snow">Are you feeling lucky?</h1>
    </div>
    <div class="d-flex flex-wrap">
      <sequential-entrance>
        <div
          v-for="index in 6"
          :key="index"
          class="inline-block">
          <div id="dummy"></div>
          <tarot-card-item
            id="element"
            :flipped="flipped"
            @flip="flip"></tarot-card-item>
        </div>
      </sequential-entrance>
    </div>
  </div>
</template>

<script>
import TarotCardItem from '@/components/movies/TarotCardItem.vue'

export default {
  components: {
    TarotCardItem,
  },
  name: "TarotCard",
  data: function() {
    return {
      flipped: false,
      backdrop_path: `${require('@/assets/tarot_background.jpg')}`,
    }
  },
  methods: {
    flip: function() {
      this.flipped = !this.flipped
    }
  },
}
</script>

<style scoped>
  #app > div > div.d-flex.flex-wrap > span {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .cont {
    width: 100%;
    height: 500px;
  }

  .inline-block {
    display: inline-block;
    width: 15%;
    min-width: 160px;
  }

  #dummy {
    margin-top: 200%;
  }

  #element {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
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
</style>