<template>
  <v-container>
    <loading-icon w="82" margin="120px auto 0" v-if="loading"></loading-icon>

    <v-row>
      <v-col>
        <div class="mobile-action" v-if="detectMobile">
          <div class="button-audio-control">
            <v-btn
              class="size-default "
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

    <v-row v-if="!loading">
      <v-col cols="12">
        <div class="story-info">
          <div class="story-image">
            <div
              class="image"
              :style="{
                'background-image': `url('${getTtvWebImageUrl(
                  currentstory.image
                )}')`,
              }"
            />
          </div>
          <div class="story-more-info">
            <h1>{{ currentstory.name }}</h1>
            <div class="mt-4">
              <v-chip color="#bababa" outlined small>{{
                currentstory.author ? currentstory.author : currentstory.name
              }}</v-chip>
            </div>
            <div class="story-intro mt-3">
              <div class="fs-13 pr-4 text-truncate">
                {{ currentstory.introduce }}
              </div>
            </div>
            <div class="story-count-chapter mt-1">
              <span class="fs-24">{{ currentstory.count_chapter }}</span>
              <span class="fs-13"> Chương</span>
            </div>
            <div class="story-interact mt-8 mt-sm-5">
              <v-btn
                color="#BF2C24"
                tile
                @click="toFirstChapter()"
                :loading="chaps.length == 0"
                >Đọc từ đầu</v-btn
              >
              <v-btn
                color="#BF2C24"
                outlined
                tile
                class="ml-3"
                :to="
                  `/read/story/${currentstory.story_url}/${currentstory.recentChapter.href}/${currentstory.recentChapter.id}`
                "
                v-if="currentstory.recentChapter"
                >Đọc tiếp</v-btn
              >
            </div>
          </div>
        </div>
        <v-row>
          <v-col>
            <v-tabs
              class="mt-6 no-arrow tab-no-uppercase"
              v-model="tab"
              background-color="transparent"
              color="#ed4259"
            >
              <v-tab>
                Thông tin chi tiết
              </v-tab>
              <v-tab>
                Danh sách chương ({{ currentstory.count_chapter }})
              </v-tab>
            </v-tabs>
            <transition-group name="fade" mode="out-in">
              <div
                class="mt-8 story-intro tab-window"
                key="tab-0"
                v-show="tab == 0"
              >
                {{ currentstory.introduce }}
                <v-divider class="mt-6" />
                <div
                  class="story-lastest-chapter mt-1 text-truncate"
                  v-if="currentstory.recentChapter"
                >
                  <span class="mr-8 label">Đọc gần đây:</span>
                  <span class="content text-truncate">
                    <router-link
                      :to="
                        `/read/story/${currentstory.story_url}/${currentstory.recentChapter.href}/${currentstory.recentChapter.id}`
                      "
                      >{{ currentstory.recentChapter.title }}</router-link
                    >
                  </span>
                </div>
                <div class="story-lastest-chapter mt-1 text-truncate">
                  <span class="mr-8 label">Mới nhất:</span>
                  <span class="content text-truncate">
                    <router-link
                      :to="
                        `/read/story/${currentstory.story_url}/${currentstory.chapter_new.url}/${currentstory.chapter_new.id}`
                      "
                      >{{ currentstory.chapter_new.name_id_chapter }}:
                      {{
                        currentstory.chapter_new.content_title_of_chapter
                      }}</router-link
                    >
                    <span class="ml-6 time " v-if="!detectMobile">{{
                      currentstory.chapter_new.time_create
                    }}</span>
                  </span>
                </div>
                <div class="story-lastest-chapter mt-1 text-truncate">
                  <span class="mr-8 label">Tình trạng:</span>
                  <span class="content">
                    <v-chip
                      dense
                      small
                      :color="
                        `${currentstory.finish == 1 ? 'green' : '#096ab7'}`
                      "
                      >{{
                        currentstory.finish ? "Hoàn thành" : "Đang ra"
                      }}</v-chip
                    >
                  </span>
                </div>
              </div>
              <div class="mt-8 tab-window" key="tab-1" v-show="tab == 1">
                <chapter
                  @getChapter="getChapters"
                  :story_id="this.currentstory.id"
                  :story_url="currentstory.story_url"
                  v-if="!loading"
                />
              </div>
            </transition-group>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  components: {
    Chapter: () => import("@/views/partials/Chapters"),
  },
  data() {
    return {
      nav: [
        {
          path: "/",
          text: "Trang chủ",
        },
      ],
      chaps: [],
      resultSearch: [],
      loading: true,
      currentstory: {
        name: "",
        id: -1,
      },
      tab: 0,
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState("app", ["recentStories", "detectMobile"]),
  },
  watch: {
    $route: function(val) {
      this.init();
    },
  },
  methods: {
    ...mapMutations("app", ["setNav", "setTopBackground"]),
    ...mapActions("app", ["showToast"]),

    init: function() {
      this.currentstory.id = Number(this.$route.params.storyId);
      this.loading = true;
      this.setNav(this.nav);

      this.$axios
        .get("story/info", {
          params: {
            id_story: this.currentstory.id,
          },
        })
        .then((rs) => {
          let { data } = rs;

          if (data.type == "error") {
            this.showToast({
              type: data.type,
              text: data.message,
            });

            this.$router.push("/404");
            return;
          } else {
            let index = this.recentStories.findIndex(
              (it) => it.id == this.currentstory.id
            );

            let recentChapter =
              index < 0 || !this.recentStories[index].recentChapter
                ? null
                : this.recentStories[index].recentChapter;

            data.data.recentChapter = recentChapter;

            this.currentstory = data.data;

            this.setNav([
              {
                path: "/",
                text: "Trang chủ",
              },
              {
                path: ``,
                text: this.currentstory.name,
              },
            ]);
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;

          this.showToast({
            type: "error",
            text: "Something went wrong!",
          });
          this.$router.push("/404");
        });
    },
    getChapters: function(chaps) {
      this.chaps = chaps;
      console.log(this.chaps.length);
    },
    toFirstChapter: function() {
      let index = this.chaps.findIndex((it) => it.type != "divider");

      if (index >= 0)
        this.$router.push(
          `/read/story/${this.currentstory.story_url}/${this.chaps[index].href}/${this.chaps[index].chapterId}`
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-window {
  min-height: 240px;
  overflow-x: hidden;
}
</style>
