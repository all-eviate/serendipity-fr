<template>
  <div style="width:185px" class="d-flex flex-column align-items-center text-center">
    <div class="photo">
      <img
        class="media"
        :src="`https://image.tmdb.org/t/p/w185${actor.actor.profile_path}`"
        alt="profile">
    </div>
    <div class="outerDiv">
      <div class="detailDiv">
        <div class="d-flex detailMid align-content-center justify-content-center">
          <div class="my-auto">
            {{actor.actor.name}}
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="d-flex align-items-center fw-bold" style="height:48px;">
      <div>
        {{actor.actor.name}}
      </div>
    </div> -->
    as
    <div style="height:64px; margin-bottom: 0px;">
      <h6 style="font-stretch:condensed">{{actor.character}}</h6>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActorListItem",
  props: {
    actor: {
      type: Object,
    }
  }
}
</script>

<style scoped>
  .photo {
    width: 100%;
    padding-top: 149%;
    position: relative;
  }
  .media {
    position:absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
  }
  .outerDiv {
    width: 100%;
    height: 60px;
    bottom: 88px;
    position: absolute;
    color: rgb(128, 118, 118);
  }
  .detailDiv {
    width: 100%;
    /* max-width: 20rem; */
    height: 100%;
    background-color: rgb(1, 1, 1, 0.8);
    position: absolute;
    /* top: -80px; */
  }
  .detailMid {
    width:100%;
    height:100%;
    position: absolute;
  }
</style>