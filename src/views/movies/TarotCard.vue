<template>
  <div class="color-snow">
    <div>
      <img alt="Profile Background" src="@/assets/profile_img/profile_background.jpg" class="background-image">
    </div>
    <div>
      <h1 style="margin-top:100px" class="mb-3">타로 카드를 뽑아보세용</h1>
    </div>
    <div class="mb-5">
      <h5 class="pb-2">오늘의 운세</h5>
      <p>{{ fortune }}</p>
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
import axios from 'axios'
import TarotCardItem from '@/components/movies/TarotCardItem.vue'

export default {
  components: {
    TarotCardItem,
  },
  name: "TarotCard",
  data: function() {
    return {
      flipped: false,
      fortune: '',
    }
  },
  methods: {
    flip: function() {
      this.flipped = !this.flipped
    }
  },
  created: function () {
  const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/fortune`
    })
      .then((res) => {
        // console.log(res)
        this.fortune = res.data.translated_text
      })
      .catch(err => {
        console.log(err)
      })
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
</style>