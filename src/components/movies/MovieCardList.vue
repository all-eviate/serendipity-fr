<template>
  <swiper class="swiper" :breakpoints="swiperOption.breakpoints" :options="swiperOption">
    <swiper-slide
      v-for="movieItem in movieList"
      :key="movieItem.title">
    <sequential-entrance>
      <movie-card-list-item
        :movieItem="movieItem"
        ></movie-card-list-item>
      <!-- <button type="button" class="btn btn-light hide">gotoseedetail</button> -->
    </sequential-entrance>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  import MovieCardListItem from '@/components/movies/MovieCardListItem.vue'

  export default {
    name: 'MovieCardList',
    title: 'Loop mode / Infinite loop',
    props: {
      movieList: {
        type: Array,
      },
    },
    components: {
      Swiper,
      SwiperSlide,
      MovieCardListItem
    },
    data: function() {
      return {
        swiperOption: {
          breakpoints: {
            600: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            800: {       
              slidesPerView: 3,       
              spaceBetween: 20     
            },
            1000: {       
              slidesPerView: 4,       
              spaceBetween: 30     
            },
            1400: {
              slidesPerView: 6,       
              spaceBetween: 30
            }
          },
          // slidesPerView: 6,
          spaceBetween: 30,
          loop: false,
          allowTouchMove: true,
          // pagination: {
          //   el: '.swiper-pagination',
          //   clickable: false,
          // },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
    methods: {
      
    }
  }
</script>

<style scoped>
  .swiper {
    height: 500px;
    width: 100%;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
  }
</style>