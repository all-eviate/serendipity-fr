<template>
  <div class="my-3" style="max-width: 300px;">
    <router-link :to="{ name: 'MovieDetail', params: { movie_pk: movie.pk }}" class="color-snow text-decoration-none">
      <div class="card bg-dark">
        <div style="height:450px;">
          <img :src="`https://image.tmdb.org/t/p/w342${movie.poster_path}`" alt="poster" class="poster card-img-top">
        </div>
        <b-card-text class="my-2">
          <big>{{ movie.title }}</big>
        </b-card-text>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'UserMovieListItem',
  props: {
    movie: {
      type: Object,
    }
  },
}
</script>

<style scoped>
.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>