<template>
  <div class="card" @click="flip">
    <div class="front">
    </div>
    <div
      class="back"
      style="background-size: cover; background-position: center;"
      :style="{ 'background-image': `url(${poster_path})` }">
      <div style="width:100%; height:100%; background: linear-gradient(to top, black, transparent)" @click="seeDetail">
        <span style="width:100%; position:absolute; bottom:0; right:0;">
          <h1 style="margin-top:auto; font-size:1.1vw;">{{ movie.title }}</h1>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'

export default {
  name: "TarotCardItem",
  props: {
    flipped: {
      type: Boolean,
    },
  },
  data: function () {
    return {
      movie: {},
      poster_path: '',
    }
  },
  methods: {
    flip: function(event) {
      if (!this.flipped) {
        let element = event.currentTarget
        if (element.className === "card") {
          if (element.style.transform == "rotateY(180deg)") {
            element.style.transform = "rotateY(0deg)"
          }
          else {
            element.style.transform = "rotateY(180deg)"
          }
        }
        this.$emit('flip')
      }
    },
    seeDetail: function() {
      this.$router.push({ name: 'MovieDetail', params: { movie_pk: this.movie.id } })
    }
  },
  created: function() {
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/r6/`,
    })
      .then(res => {
        this.movie = _.sample(res.data)
        this.poster_path = `https://image.tmdb.org/t/p/w342${this.movie.poster_path}`
      })
      .catch(err => {
        console.log(err)
      })
  },
}
</script>

<style scoped>
  .card {
    display: inline-block;
    background-color: gray;
    width: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    cursor: pointer;
  }

  .front, .back {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
  }

  .front {
    border: 2px solid black;
    background: url('../../assets/tarot.png');
    background-size: 100% 100%;
    filter: brightness(0.7);
    top: 0px;
  }

  .front:hover {
    box-shadow: 0px 0px 20px 1px #000;
  }

  .back {
    border: 2px solid black;
    transform: rotateY(180deg);
  }

  .back:hover {
    box-shadow: 0px 0px 20px 1px #000;
  }
</style>