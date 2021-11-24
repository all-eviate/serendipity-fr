<template>
  <swiper class="swiper" :breakpoints="swiperOption.breakpoints" :options="swiperOption">
    <swiper-slide
      v-for="actor in actors"
      :key="actor.cast_id">
      <actors-list-item
        :actor="actor"
        ></actors-list-item>
        <!-- <button type="button" class="btn btn-light hide">gotoseedetail</button> -->
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
  <!-- <div class="d-flex justify-content-between">
    <actors-list-item
      v-for="actor in actors"
      :key="actor.cast_id"
      :actor="actor"></actors-list-item>
  </div> -->
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import ActorsListItem from './ActorsListItem.vue'
export default {
  components: {
    Swiper,
    SwiperSlide,
    ActorsListItem
  },
  name: "ActorsList",
  props: {
    actors: {
      type: Array,
    }
  },
  data: function() {
    return {
      swiperOption: {
        // breakpoints: {
        //   600: {
        //     slidesPerView: 4,
        //     spaceBetween: 10
        //   },
        //   800: {       
        //     slidesPerView: 4,       
        //     spaceBetween: 20     
        //   },
        //   1000: {       
        //     slidesPerView: 4,       
        //     spaceBetween: 30     
        //   },
        //   1400: {
        //     slidesPerView: 4,       
        //     spaceBetween: 30
        //   }
        // },
        slidesPerView: 3,
        spaceBetween: 1,
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
  }
}
</script>

<style scoped>
  .swiper {
    max-height: 382px;
    height: 100%;
    width: 100%;
  }
  .swiper-slide {
    /* width: 185px; */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
  }

</style>