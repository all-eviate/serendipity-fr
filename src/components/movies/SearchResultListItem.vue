<template>
  <div class="container color-snow">
    <b-row align-v="center">
      <b-col cols="12" lg="3">
        <img :src="poster_path" alt="poster" style="margin:20px; max-height:300px">
      </b-col>
      <b-col cols="12" lg="9">
        <div class="d-flex flex-column justify-content-between align-items-stretch" style="margin:20px; text-align:left;">
          <div class="mb-3">
            <h2 style="display: inline; margin-right:10px;">{{ title }}</h2>
            <p style="display: inline">({{ release_date }})</p>
          </div>
          <p class="overview">{{ overview }}</p>
          <p>{{ genres }}</p>
          <div>
            <button type="button" class="btn btn-outline-light" @click="seeDetail">about this movie</button>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'
// import { mapGetters } from 'vuex'

// const movieStore = 'movieStore'

export default {
  name: "SearchResultListItem",
  props: {
    movieItem: {
      type: Object,
    },
    genreTable: {
      type: Array,
    }
  },
  data: function() {
    return {
      id: '',
      poster_path: '',
      title: '',
      release_date: '',
      overview: '',
      genres: '',
    }
  },
  methods: {
    seeDetail: function() {
      this.$router.push({ name: 'MovieDetail', params: { movie_pk: this.movieItem.pk } })
    }
  },
  created: function() {
    const SERVER_URL = process.env.VUE_APP_SERVER_URL
    axios({
      method: 'get',
      url: `${SERVER_URL}/movies/${this.movieItem.pk}/`,
    })
      .then(res => {
        this.poster_path = `https://image.tmdb.org/t/p/w342${res.data.poster_path}`
        this.id = res.data.id
        this.title = res.data.title
        this.release_date = res.data.release_date
        this.overview = res.data.overview
        const genre_pk_list = res.data.genres
        const genre_picked_list = this.genreTable.filter(element => genre_pk_list.includes(element.id))
        const genre_name_list = genre_picked_list.map(element => element.name)
        this.genres = `장르: ${genre_name_list.join(', ')}`
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
  .overview {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
  }
</style>