<template>
  <div>
    <div style="margin:100px auto 50px; width: 90%; max-width:640px">
      <b-input-group>
        <template #prepend>
          <b-dropdown :text="searchCriteria" variant="success" id="criteriaDD">
            <b-dropdown-item @click="changeToTitle">Title</b-dropdown-item>
            <b-dropdown-item @click="changeToGenre">Genre</b-dropdown-item>
          </b-dropdown>
        </template>
        <b-form-input
          v-model="searchQuery"
          variant="light"
          class="inputfocus"
          style="text-align: center;"
          :disabled="searchCriteria==='Genre'"
          @keyup.enter="searchByTitle"></b-form-input>
        <b-input-group-append>
          <b-button variant="success" @click="searchByTitle" :disabled="searchCriteria==='Genre'">Search</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div v-if="searchCriteria==='Genre'" style="width: 50%; margin: 50px auto;" class="d-flex flex-wrap justify-content-center">
      <button
        v-for="genreItem in genreList"
        :key="genreItem.id"
        type="button"
        :value="genreItem.name"
        class="btn btn-outline-light mx-2 mb-2"
        @click="searchByGenre"
      >{{ genreItem.name }}</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "TheSearchBar",
  data: function() {
    return {
      searchCriteria: 'Title',
      searchQuery: '',
    }
  },
  props: {
    genreList: {
      type: Array,
    }
  },
  methods: {
    changeToTitle: function() {
      this.searchCriteria = "Title"
    },
    changeToGenre: function() {
      this.searchQuery = ''
      this.searchCriteria = "Genre"
    },
    searchByGenre: function(event) {
      this.$emit('search-by-genre', event.target.value)
    },
    searchByTitle: function() {
      this.$emit('search-by-title', this.searchQuery)
    }
  }
}
</script>

<style scoped>
  ::v-deep .dropdown-menu {
    color: #121212;
    background-color: #681912;
  }
  ::v-deep .dropdown-item {
    color: #121212;
  }
  .inputfocus:focus, textarea {
    background-color: #E5E5E5;
  }
  input[type="text"], textarea {
    background-color: #E5E5E5;
    border: 0px;
    color: #121212;
  }
</style>

<style>
  .btn-success {
    color: #E5E5E5 !important;
    border-color: #8C2016 !important;
    background-color: #8C2016 !important;
  }
</style>