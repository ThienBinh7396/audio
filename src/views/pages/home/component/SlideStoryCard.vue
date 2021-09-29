<template>
  <div>
    <h2 class="mb-2">{{ listTitle }}</h2>
    <div class="mt-5">
      <hooper
        :settings="hooperSettings"
        :wheelControl="false"
        class="small-navigation px-1"
      >
        <slide class="card-container" v-for="story in stories" :key="story.id">
          <story-card :data="story" />
        </slide>
        <hooper-navigation slot="hooper-addons"></hooper-navigation>
      </hooper>
    </div>
  </div>
</template>

<script>
import StoryCard from "@/views/pages/home/component/StoryCard";
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";

export default {
  components: {
    StoryCard,
    Hooper,
    Slide,
    HooperNavigation,
  },
  props: {
    listTitle: {
      type: String,
    },
    stories: {
      type: Array,
    },
  },
  data() {
    return {
      hooperSettings: {
        itemsToShow: 1,
        breakpoints: {
          480: {
            itemsToShow: 2,
          },
          600: {
            itemsToShow: 3,
          },
          960: {
            itemsToShow: 4,
          },
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  width: 100% !important;

  @media screen and (min-width: 480px) {
    width: 50% !important;
  }

  @media screen and (min-width: 600px) {
    width: 33.33% !important;
  }

  @media screen and (min-width: 960px) {
    width: 25% !important;
  }
}
</style>
