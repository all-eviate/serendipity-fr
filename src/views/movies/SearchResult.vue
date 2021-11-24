<template>
  <div>
    <div class="color-snow">
      <div>
        <h1 class="title">{{ query }}의 {{ criteria }} 검색 결과</h1>
      </div>
    </div>
    <the-search-bar
      :genreList="genreList"
      @search-by-title="searchByTitle"
      @search-by-genre="searchByGenre"></the-search-bar>
    <search-result-list
      :resultList="resultList"
    ></search-result-list>
  </div>
</template>

<script>
import axios from 'axios'
import SearchResultList from '@/components/movies/SearchResultList.vue'
import TheSearchBar from '@/components/movies/TheSearchBar.vue'
import { mapGetters } from 'vuex'

const movieStore = 'movieStore'

export default {
  components: {
    SearchResultList,
    TheSearchBar,
  },
  name: "SearchResult",
  data: function () {
    return {
      // message: `Hello ${departure.MY_CONST}`,
      criteria: '',
      query: '',
      resultList: [],
      // genreList: [],
    }
  },
  methods: {
    searchByGenre: function(searchQuery) {
      this.$router.push({ name: 'SearchResult', params: { criteria: 'genre', query: searchQuery } })
    },
    searchByTitle: function(searchQuery) {
      this.$router.push({ name: 'SearchResult', params: { criteria: 'title', query: searchQuery } })
    },
    searchResult: function () {
      if (this.$route.params.criteria === 'genre') {
        this.criteria = '장르'
      } else if (this.$route.params.criteria === 'title') {
        this.criteria = '제목'
      }
      this.query = this.$route.params.query
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/search/${this.$route.params.criteria}/${this.$route.params.query}/`,
        headers: this.$store.state.authorized_token,
      })
        .then(res => {
          this.resultList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created: function () {
    this.searchResult()
  },
  computed: {
    ...mapGetters(movieStore, {
      genreList: 'GET_GENRE_TABLE'
    })
  }
}
</script>

<style>
  .title {
    height:120px;
    text-align: center;
  }
</style>