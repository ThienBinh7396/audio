<template>
  <div class="pa-4">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="url"
        :rules="urlRules"
        label="Chapter url..."
        required
      />

      <v-layout>
        <v-flex>
          <v-btn color="success" @click="gotoChapter"> Goto Chapter </v-btn>
        </v-flex>
        <v-flex class="ml-3">
          <v-select
            :items="Object.keys(testUrl)"
            label="Test URL"
            dense
            solo
            @change="(val) => (url = testUrl[val])"
          />
        </v-flex>
      </v-layout>
    </v-form>

    <loading-icon w="82" margin="160px auto 0" v-if="loading" />

    <setting :reading="reading" />

    <v-layout
      class="flex-column text-center mt-6"
      v-if="!loading && recentStory && !recentStory.data && recentStory.message"
    >
      <v-icon size="68">mdi-alert-rhombus</v-icon>

      <p
        class="body-1 mt-4 mb-2"
        v-html="
          recentStory.message.match(/not support/i)
            ? recentStory.message
            : 'Failded to <b>fetch</b>'
        "
      />

      <h6>{{ url }}</h6>
    </v-layout>

    <div
      class="chapter mt-4 px-0 px-md-5 px-lg-10"
      v-if="!loading && recentStory && recentStory.data"
    >
      <h1 class="mt-2 text-center">{{ recentStory.data.storyTitle }}</h1>
      <div class="title text-center">{{ recentStory.data.chapterTitle }}</div>
      <div
        class="chapter-content mt-12 mb-12"
        :style="{ 'font-size': `${config.fontSize}px` }"
      >
        <p
          class="px-3"
          v-for="(line, index) in recentStory.data.content"
          :key="`line-${index}`"
          :id="`js-line-${index}`"
          v-html="line.trim()"
        />
      </div>
      <div class="control-box d-flex justify-space-between px-6 mt-4 mb-12">
        <v-btn
          outlined
          @click="navigateChapter(false)"
          v-show="recentStory.data.currentChapterIndex != 0"
        >
          <v-icon class="mr-1">mdi-arrow-left</v-icon>
          Previous
        </v-btn>
        <v-btn
          @click="navigateChapter()"
          outlined
          v-show="recentStory.data.currentChapterIndex"
        >
          Next
          <v-icon class="ml-1">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  components: {
    Setting: () => import("@/views/partials/Setting"),
  },
  data() {
    return {
      valid: true,
      loading: false,
      url:
        "https://wikidich.com/truyen/tien-ma-dong-tu/chuong-3694-ao-anh-dao-tau-XrtqcsQsRAaSGu5Y",
      urlRules: [(v) => !!v || "Name is required"],
      select: null,
      checkbox: false,
      storyInfo: null,
      reading: false,
    };
  },
  computed: {
    ...mapState("app", ["showNav", "config", "recentStory", "testUrl"]),
  },
  mounted() {
    this.setShowNav(false);
    console.log(this);
  },
  methods: {
    ...mapMutations("app", [
      "setShowNav",
      "setConfig",
      "setRecentStory",
      "setTestURL",
    ]),
    ...mapActions("app", ["showToast"]),
    gotoChapter() {
      this.loading = true;
      this.$axios
        .post("/story/fetchContentByUrl", {
          chapter_url: this.url,
        })
        .then((res) => {
          const {
            data: {
              data,
              type,
              message,
            },
          } = res;

          console.log(res.data);

          if (type == "error") {
            this.showToast({
              type,
              text: message,
            });
            this.setRecentStory({ data: null, type, message });
          } else {
            this.setRecentStory({
              data: {
                ...data,
                content: data.content.split("\n"),
                type: "success",
              },
            });

            this.setTestURL({
              ...this.testUrl,
              [data.website]: this.url,
            });
          }

          this.loading = false;
          this.scrollToTop(true);
        })
        .catch((err) => {
          console.log(err);
          this.setRecentStory({ data: null, type: "error" });
        });
    },
    navigateChapter(isNext = true) {
      if (!this.recentStory) return;

      const { data } = this.recentStory;

      this.url = isNext ? data.nextChapter : data.prevChapter;
      this.gotoChapter();
    },
    scrollToTop: function (onlyTop) {
      let height = document.getElementById(`main-content`).offsetHeight;

      let div = document.body;

      if (onlyTop) {
        $(div).animate(
          {
            scrollTop: -height,
          },
          300
        );

        return;
      }

      $(div).animate(
        {
          scrollTop: this.scrollTop ? -height : height,
        },
        300
      );
    },
  },
};
</script>
