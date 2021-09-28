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
        <section
          class="box-center mt-6"
          v-if="recent_stories && recent_stories.length != 0"
        >
          <h2 class="mb-2 text---lightColor">Truyện đã đọc</h2>

          <div class="mt-5">
            <hooper
              :settings="hooperSettings"
              :wheelControl="false"
              class="small-navigation px-1"
            >
              <slide
                v-for="(item, index) in recent_stories"
                :key="`_recent-story-${index}`"
              >
                <v-card
                  class="ma-1 mr-4 pa-0 transparent slide-story"
                  elevation="4"
                  @click="
                    $router.push(
                      `/read/story/${item.story_url}/${item.recentChapter.href}/${item.recentChapter.id}`
                    )
                  "
                >
                  <div class="pb-0">
                    <div class="image">
                      <img :src="getTtvWebImageUrl(item.image)" width="100%" />
                    </div>
                    <div class="absolute-top">
                      <v-chip color="#1b8ee0" label>
                        {{ item.category_name }}
                      </v-chip>
                    </div>
                    <div class="information">
                      <div class="name">{{ item.name }}</div>
                      <div class="tb-link">{{ item.recentChapter.title }}</div>
                      <div class="continue">
                        <div>Đọc tiếp</div>
                        <div class="icon">
                          <v-icon
                            class="ld ld-slide-ltr"
                            color="#1b8ee0"
                            size="20"
                            >mdi-chevron-right</v-icon
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </slide>
              <hooper-navigation slot="hooper-addons"></hooper-navigation>
            </hooper>
          </div>
        </section>

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
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import SlideStoryCard from "@/views/pages/home/component/SlideStoryCard";

export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation,
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
      slides: [
        {
          image: "/img/slide1.jpg",
          url: "story/Mục%20Thần%20Ký/17299",
        },
        {
          image: "/img/slide2.jpg",
          url: "/story/Phi%20Kiếm%20Vấn%20Đạo/17987",
        },
        {
          image: "/img/slide3.jpg",
          url:
            "/story/Phàm%20Nhân%20Tu%20Tiên%20Chi%20Tiên%20Giới%20Thiên/18229",
        },
        {
          image: "/img/slide6.jpg",
          url: "/story/Tam%20Thốn%20Nhân%20Gian/20640",
        },
      ],
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
  mounted() {
    this.setNav(this.nav);
    this.setTopBackground("/img/top_background.jfif");
  },
  computed: {
    ...mapState("app", ["detectMobile", "recentStories"]),
    recent_stories: {
      get() {
        return this.recentStories;
      },
      set(val) {
        this.recent_stories = val;
      },
    },
  },
  created() {
    this.initialData();
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
        console.log(response.data.data);

        this.slideStories.newStories.data = storyNews;
        this.slideStories.finishStories.data = storyFinish;
        this.slideStories.newUpdateStories.data = storyStarts;
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
