<template>
  <v-container class="pt-0 px-4">
    <v-row>
      <v-col>
        <v-carousel
          v-model="slideIndex"
          cycle
          :height="detectMobile ? 180 : 320"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :src="slide.image"
            :key="'slide-' + i"
            v-ripple
            @click="$router.push(slide.url)"
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="mobile-action" v-if="detectMobile">
          <div class="button-audio-control">
            <v-btn
              class="size-default"
              color="#2740e0"
              dark
              fab
              @click.stop="startSpeak()"
            >
              <div @click.stop="$store.commit('app/setShowSearch', true)">
                <v-icon class="ld ld-tremble">mdi-magnify</v-icon>
              </div>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-for="(slideStory, key) in slideStories" :key="key">
          <section class="box-center mt-6" v-if="slideStory.data.length != 0">
            <slide-story-card
              :listTitle="slideStory.title"
              :stories="slideStory.data"
            />
          </section>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import SlideStoryCard from "@/views/pages/home/component/SlideStoryCard";

import { HOME_SLIDE_DATA } from "@/constants/constants";

export default {
  components: {
    SlideStoryCard,
  },
  data() {
    return {
      nav: [
        {
          path: "/",
          text: "Trang chủ",
        },
      ],
      slideIndex: 0,
      slides: HOME_SLIDE_DATA,
      slideStories: {
        recentStories: {
          title: "Truyện đã đọc",
          data: [],
        },
        newStories: {
          title: "Truyện mới",
          data: [],
        },
        finishStories: {
          title: "Truyện đã hoàn thành",
          data: [],
        },
        newUpdateStories: {
          title: "Truyện mới cập nhật",
          data: [],
        },
      },
      news: null,
      finish: null,
      newUpdate: null,
    };
  },
  created() {
    this.initialData();
  },
  mounted() {
    this.setNav(this.nav);
    this.setTopBackground("/img/top_background.jfif");
  },
  computed: {
    ...mapState("app", ["detectMobile", "recentStories"]),
  },
  watch: {
    recentStories: function(val) {
      console.log(val);
      this.slideStories.recentStories.data = val;
    },
  },
  methods: {
    ...mapMutations("app", ["setNav", "setTopBackground"]),
    initialData: function() {
      this.$axios.get("/story/home").then((response) => {
        let {
          story_news: storyNews,
          story_finish: storyFinish,
          story_starts: storyStarts,
        } = response.data.data;

        this.slideStories.newStories.data = storyNews;
        this.slideStories.finishStories.data = storyFinish;
        this.slideStories.newUpdateStories.data = storyStarts;
        this.slideStories.recentStories.data = this.recentStories;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.story-result {
  position: relative;
  width: 100%;
  margin-top: 12px;
  overflow-x: hidden;
  max-height: calc(100vh - 100px);
  padding-right: 8px;

  .story-content {
    position: relative;
    background: #2a3b4d;
    display: flex;
    margin: 0px 16px 12px;
    padding: 8px 24px 8px 16px;
    cursor: pointer;

    &:hover {
      background: rgba(118, 140, 163, 0.5);
    }

    .story-index {
      width: 40px;
    }

    .story-close {
      position: absolute;
      right: 16px;
      top: 7px;
      transition: 0.3s;

      &:hover i {
        color: #fff !important;
      }
    }
  }
}
</style>
