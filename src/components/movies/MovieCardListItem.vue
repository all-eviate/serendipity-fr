<template>
  <div style="height:100%;">
    <div style="max-width: 20rem; height:400px;" class="mb-2">
      <img
        :src="imgUrl" alt="poster"
        style="width: 100%; height: 100%; object-fit: cover;"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave">
      <div class="outerDiv">
        <div v-if="isHover" class="detailDiv" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
          <div class="d-flex detailMid align-content-center justify-content-center">
            <div class="my-auto">
              <button type="button" class="btn btn-outline-light" @click="seeDetail">about this movie</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h1 style="color: white; font-size:1.1vw;">
      <div style="max-width: 20rem; width: 100%">
        <span class="nowrap" style="width: 100%;">
          {{movieItem.title}}
        </span>
      </div>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'MovieCardListItem',
  props: {
    movieItem: {
      type: Object,
    }
  },
  data: function() {
    return {
      isHover: false,
    }
  },
  methods: {
    mouseEnter: function() {
      this.isHover=true
    },
    mouseLeave: function() {
      this.isHover=false
    },
    seeDetail: function() {
      this.$router.push({ name: 'MovieDetail', params: { movie_pk: this.movieItem.pk } })
    }
  },
  computed: {
    imgUrl: function() {
      return "https://image.tmdb.org/t/p/w342" + this.movieItem['poster_path']
    }
  }
}
</script>

<style scoped>
  .box{
    width: 100%;
    height: 100%;
    transition: width 0.8s, height 0.8s;
  }
  .box:hover{
    /* transform: translate(-10%, 0); */
    width: 120%;
    height: 120%;
  }
  .outerDiv {
    width: 100%;
    height: 80px;
  }
  .detailDiv {
    width: 100%;
    max-width: 20rem;
    height: 80px;
    background-color: rgb(1, 1, 1, 0.8);
    position: relative;
    top: -80px;
  }
  .detailMid {
    width:100%;
    height:100%;
    position: relative;
  }
  .nowrap {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
</style>