<template>
  <div>
    <h2 class="mb-2 text---lightColor">{{ listTitle }}</h2>
    <div class="mt-5">
      <hooper
        :settings="hooperSettings"
        :wheelControl="false"
        class="small-navigation px-1"
      >
        <slide v-for="story in stories" :key="`_recent-story-${story.id}`">
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
          576: {
            itemsToShow: 2,
          },
          800: {
            itemsToShow: 4,
          },
        },
      },
    };
  },
};
</script>

<style></style>
