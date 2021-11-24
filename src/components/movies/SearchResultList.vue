<template>
  <div>
    <search-result-list-item
      v-for="movieItem in list"
      :key="movieItem.pk"
      :movieItem="movieItem"
      :genreTable="genreTable"></search-result-list-item>
    <infinite-loading spinner="spiral" @infinite="infiniteHandler">
      <div slot="no-more" class="color-snow pb-3">끝! :) <br> <b-button @click="toTop" class="btn-color-sub my-4">TO TOP</b-button></div>
      <div slot="no-results">No results :(</div>
    </infinite-loading>
  </div>
</template>

<script>
import SearchResultListItem from './SearchResultListItem.vue'
import InfiniteLoading from 'vue-infinite-loading'
import { mapState } from 'vuex'
import axios from 'axios'

const movieStore = 'movieStore'

export default {
  components: {
    SearchResultListItem,
    InfiniteLoading,
  },
  name: "SearchResultList",
  data: function() {
    return {
      page: 1,
      list: [],
    }
  },
  methods: {
    infiniteHandler($state) {
      const SERVER_URL = process.env.VUE_APP_SERVER_URL
      axios({
        method: 'get',
        url: `${SERVER_URL}/movies/search/${this.$route.params.criteria}/${this.$route.params.query}/?page=${this.page}`,
      })
        .then(({data}) => {
          console.log(data)
          if (data.length) {
            this.page += 1
            this.list.push(...data)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch(({response}) => {
          if (response.status === 404) {
            $state.error()
          }
          console.log(response)
        })
    },
    toTop: function() {
      window.scrollTo(0, 0)
    }
  },
  computed: {
    ...mapState(movieStore, [
      'genreTable'
    ]),
  },
}
</script>

<style>

</style>