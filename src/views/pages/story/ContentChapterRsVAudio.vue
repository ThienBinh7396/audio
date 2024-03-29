<template>
  <v-row>
    <v-col cols="12" class="relative">
      <loading-icon w="82" margin="160px auto 0" v-if="loading"></loading-icon>
      <loading-circular-dialog :show="loadingNewChapter" />

      <div class="d-none">
        <audio
          preload="metadata"
          id="speech-audio"
          @error="error('audio')"
          @ended="ended('audio')"
          @play="play('audio')"
          @playing="playing('audio')"
        />
        <audio
          preload="metadata"
          id="speech-audio-another"
          @error="error('audioAnother')"
          @ended="ended('audioAnother')"
          @play="play('audioAnother')"
          @playing="playing('audioAnother')"
        />
      </div>

      <div class="tb-dialog" :class="{ show: dialog }" v-if="!loading">
        <div class="tb-dialog-overplay" @click="dialog = false" />
        <v-card class="dialog-chapter-content" id="js-dialog-chapter-content">
          <chapter
            :dialog="true"
            @getChapter="getChapters"
            :current="Number(chapterId)"
            :storyId="storyInfo.id"
            :storyUrl="storyInfo.urlStory"
          />
        </v-card>
      </div>

      <div class="tb-dialog" :class="{ show: dialogSetting }" v-if="!loading">
        <div class="tb-dialog-overplay" @click="dialogSetting = false" />
        <v-card class="dialog-setting-content">
          <v-card-title class="px-3 py-2 text-blur">Cấu Hình: </v-card-title>
          <user-config-dialog class="px-3" />
        </v-card>
      </div>

      <div class="tb-dialog" :class="{ show: dialogTimer }" v-if="!loading">
        <div class="tb-dialog-overplay" @click="dialogTimer = false" />
        <v-card class="dialog-setting-content">
          <v-card-title class="px-3 pt-1 py-2 text-blur"
            >Hẹn giờ tắt:
          </v-card-title>
          <v-text-field
            class="px-4 mt-1"
            id="countdown-timer-input"
            type="number"
            min="1"
            max="720"
            @keydown="checkNumber($event)"
            @keyup="checkMax()"
            @change="checkMax()"
            @blur="checkMax()"
            @focus="checkMax()"
            label="Điền số phút..."
            solo
            single-line
            outlined
            dense
          ></v-text-field>
          <div class="px-4 mb-4">
            <v-btn small color="#1e9022" @click="startCountDownTimer()"
              >Bắt đầu</v-btn
            >
          </div>
        </v-card>
      </div>

      <div
        class="countdown-timer"
        v-show="showTimer"
        :class="{ sticky: currentScrollPoint > 180 }"
      >
        <div class="countdown-timer-chapter"></div>
      </div>

      <div class="chapter px-0 px-md-5 px-lg-10" v-if="!loading">
        <h1 class="mt-2 text-center">{{ storyInfo.titleStory }}</h1>
        <div class="title text-center">{{ storyInfo.chapter }}</div>
        <div
          class="chapter-content mt-12 mb-12"
          :style="{ 'font-size': `${audioConfig.fontSize}px` }"
        >
          <p
            :class="{ active: index == currentLine }"
            @click="startSpeakLine(index)"
            class="px-3"
            v-for="(line, index) in storyInfo.content"
            :key="`line-${index}`"
            :id="`js-line-${index}`"
            v-html="line"
          ></p>
        </div>
        <div class="control-box d-flex justify-space-between px-6 mt-4 mb-12">
          <v-btn outlined @click="prevChapter()" v-if="getIndex() != 0">
            <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Previous
          </v-btn>
          <v-btn
            outlined
            @click="nextChapter()"
            v-if="getIndex() != chapters.length - 1"
          >
            Next
            <v-icon class="ml-1">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <div class="button-action-group" v-if="!detectMobile">
        <v-speed-dial
          v-model="fab"
          top
          direction="top"
          :open-on-hover="false"
          transition="slide-y-reverse-transition"
        >
          <template v-slot:activator>
            <v-btn v-model="fab" color="#1088ff" dark fab>
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else size="26">mdi-gesture-double-tap</v-icon>
            </v-btn>
          </template>
          <v-btn
            class="size-default"
            color="#2740e0"
            dark
            fab
            @click.stop="startSpeak()"
          >
            <radio-gif
              width="32"
              v-if="reading"
              style="margin-right: -2px; margin-top: -2px"
            />
            <v-icon v-if="!reading">mdi-headphones-settings</v-icon>
          </v-btn>
          <v-btn color="#FF8D00FF" small dark fab @click.stop="dialog = true">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
          <v-btn
            color="#ff0000"
            small
            dark
            fab
            @click.stop="dialogTimer = true"
          >
            <v-icon>mdi-timer</v-icon>
          </v-btn>
          <v-btn
            color="#529e33"
            small
            dark
            fab
            @click.stop="dialogSetting = true"
          >
            <v-icon class="ld xhalf ld-spin">mdi-cog</v-icon>
          </v-btn>
          <v-btn color="#F44336" small dark fab @click.stop="scrollToTop()">
            <v-icon class="ld ld-jump" :class="{ 'mt-1': !scrollTop }">{{
              scrollTop ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-speed-dial>
      </div>
      <div class="mobile-action" v-if="detectMobile">
        <div class="bottom-button-control">
          <div @click.stop="scrollToTop()">
            <v-icon class="ld ld-jump" :class="{ 'mt-1': !scrollTop }">{{
              scrollTop ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </div>
          <div @click.stop="dialogSetting = true">
            <v-icon class="ld xhalf ld-spin">mdi-cog</v-icon>
          </div>
          <div @click.stop="dialogTimer = true">
            <v-icon class="ld ld-jingle">mdi-timer</v-icon>
          </div>
          <div @click.stop="$store.commit('app/setShowSearch', true)">
            <v-icon class="ld ld-tremble">mdi-magnify</v-icon>
          </div>
          <div @click.stop="dialog = true">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </div>
        </div>
        <div class="button-audio-control">
          <v-btn
            class="size-default"
            color="#2740e0"
            dark
            fab
            @click.stop="startSpeak()"
          >
            <radio-gif
              width="32"
              v-if="reading"
              style="margin-right: -2px; margin-top: -2px"
            />
            <v-icon v-if="!reading">mdi-headphones-settings</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    Chapter: () => import("@/views/partials/Chapters"),

    UserConfigDialog: () => import("@/views/partials/UserConfigDialog.vue"),
  },
  data() {
    return {
      fab: true,
      dialog: false,
      dialogSetting: false,
      dialogSearch: false,
      dialogTimer: false,
      showTimer: false,
      countDown: null,
      storyUrl: "",
      chapter_url: "",
      chapterId: -1,
      storyInfo: {},
      chapters: [],
      loading: false,
      loadingNewChapter: false,
      currentLine: 0,
      pathInLine: [],
      reading: false,
      voice: "Vietnamese Female",
      scrollTop: false,
      currentScrollPoint: 0,
      audio: null,
      audioCountError: 0,
      audioAnother: null,
      audioAnotherCountError: 0,
      currentAudio: "audio",
      baseApiUrl: "",
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState("app", ["audioConfig", "detectMobile", "recentStories"]),
  },
  watch: {
    $route: function(val) {
      this.dialog = false;

      this.init();
    },
    audioConfig: function(val) {
      this.updateAudioConfig();
    },
  },
  methods: {
    ...mapMutations("app", [
      "setNav",
      "setTitle",
      "setShowSearch",
      "setTopBackground",
    ]),
    ...mapActions("app", ["showToast", "updateRecentlyStory"]),
    init: function() {
      let { storyUrl, chapter_url, chapterId } = this.$route.params;

      this.storyUrl = storyUrl;
      this.chapter_url = chapter_url;
      this.chapterId = chapterId;

      this.baseApiUrl = this.$axios.defaults.baseURL;

      this.loading = true;
      this.loadContent();
    },
    loadContent: function() {
      this.$axios
        .get(`/story/read`, {
          params: {
            storyUrl: this.storyUrl,
            chapter_url: this.chapter_url,
          },
        })
        .then((rs) => {
          let { data } = rs;

          if (
            data.type == "error" ||
            data.data.id == null ||
            !data.data.titleStory
          ) {
            this.$router.push("/404");
            return;
          }

          this.loading = false;
          this.loadingNewChapter = false;

          let contents = data.data.content
            .split(/\n+/)
            .filter((it) => it && it.trim().length != "");

          data.data.content = contents;

          this.storyInfo = data.data;
          this.currentLine = 0;

          if (this.reading) {
            this.currentAudio = "audio";

            this.audio.src = this.getUrl(this.currentLine);

            this.speak();
          }

          this.setNav([
            {
              path: "/",
              text: "Trang chủ",
            },
            {
              path: `/story/${this.storyInfo.urlStory}/${this.storyInfo.id}`,
              text: this.storyInfo.titleStory,
            },
            {
              path: ``,
              text: this.storyInfo.chapter,
            },
          ]);

          this.setTitle(
            `${this.storyInfo.titleStory} - ${this.storyInfo.chapter}`
          );

          window.history.replaceState(
            {},
            "",
            `/read/story/${this.storyUrl}/${this.chapter_url}/${this.chapterId}`
          );

          this.scrollToTop(true);

          if (this.reading) this.speak();

          this.updateRecentlyStory({
            storyInfo: this.storyInfo,
            chapterId: this.$route.params.chapterId,
            chapterHref: this.$route.params.chapter_url,
          });

          let index = this.recentStories.findIndex(
            (it) => it.id == this.storyInfo.id
          );

          if (index >= 0) {
            this.setTopBackground(
              this.getTtvWebImageUrl(this.recentStories[index].image)
            );
          }
        });
    },
    updateAudioConfig: function() {
      if (this.audio) {
        this.audio.volume = this.audioConfig.volume;
        this.audio.playbackRate = this.audioConfig.speed;
      }

      if (this.audioAnother) {
        this.audioAnother.volume = this.audioConfig.volume;
        this.audioAnother.playbackRate = this.audioConfig.speed;
      }
    },
    select: function() {
      let selectText = "";

      if (window.getSelection) {
        console.log(window.getSelection);
        selectText = window.getSelection().toString();
      } else if (document.selection) {
        console.log(document.selection);
        selectText = document.selection.createRange().text;
      }

      if (selectText.length != 0) {
        this.speak(selectText, false);
      }
    },
    startSpeak: function(speak = true) {
      this.reading = !this.reading;
      if (!speak) this.reading = false;

      if (this.reading) {
        if (this.currentLine == 0) {
          this.audio.src = this.getUrl(this.currentLine);

          this.speak();
        } else {
          this[this.currentAudio].play();
        }
      } else {
        this.audio.pause();
        this.audioAnother.pause();
      }
    },
    play: function() {
      this.updateAudioConfig();
    },
    playing: function(ref) {
      if (ref == "audio") {
        this.audioCountError = 0;
      } else {
        this.audioAnotherCountError = 0;
      }

      if (this.currentAudio != ref) {
        this[ref].pause();
        this[ref].currentTime = 0;
      }
    },
    ended: function() {
      if (
        this.currentLine == this.storyInfo.content.length - 1 &&
        this.getIndex() != this.chapters.length - 1
      ) {
        responsiveVoice.speak(
          `Chương tiếp! ${this.chapters[this.getIndex() + 1].title}}`,
          this.voice,
          {
            rate: 1.3,
          }
        );

        setTimeout(() => {
          this.next();
        }, 2500);
      } else {
        this.next();
      }
    },
    error: function(ref) {
      setTimeout(() => {
        console.log("error: ", ref);

        let text = this[ref].src.match(/\?text=(?<text>.*?)&/)[1];

        if (text[text.length - 1] == ".") {
          text = text.substring(0, text.length - 1);
        } else {
          text = `${text}.`;
        }

        let check = false;

        if (ref == "audio") {
          this.audioCountError++;
          if (this.audioCountError > 3) {
            check = true;
          }
        } else {
          this.audioAnotherCountError++;

          if (this.audioAnotherCountError > 3) {
            check = true;
          }
        }

        if (check) {
          if (this.currentAudio == ref) {
            console.log(this.currentLine);
            this.audioAnotherCountError = 0;
            this.audioCountError = 0;
            this.audio.src = "";
            this.audioAnother.src = "";
            this.next(true);
          }
        } else {
          this[ref].src = this.getUrlWithText(text);

          this[ref].load();
          this[ref].play();
        }
      }, 3000);
    },
    getUrl: function(index) {
      let text = encodeURI(this.storyInfo.content[index]);
      return `${this.baseApiUrl}story/textToSpeech?text=${text}&lang=vi&engie=g1&rate=0.53&key=32hDX4HJ&volume=1&gender=female`;
    },
    getUrlWithText: function(text) {
      return `${this.baseApiUrl}story/textToSpeech?text=${text}&lang=vi&engie=g1&rate=0.53&key=32hDX4HJ&volume=1&gender=female`;
    },
    speak: function() {
      let a = this.currentAudio == "audio" ? "audioAnother" : "audio";

      this[a].src =
        this.currentLine == this.storyInfo.content.length - 1
          ? "/audio/temp-audio.mp3"
          : this.getUrl(this.currentLine + 1);

      this[a].load();

      //console.log(this[a]);

      this[this.currentAudio].play();

      this.scrollText();
    },
    startSpeakLine: function(index) {
      if (this.currentLine == index) {
        this.startSpeak();

        return;
      }

      if (!this.reading) {
        this.reading = true;
      }
      this.currentLine = index;
      this.currentAudio = "audio";

      this.audio.src = this.getUrl(this.currentLine);

      this.speak();
    },
    next: function(refresh = false) {
      if (!this.reading) return;

      if (refresh) {
        this.currentLine++;
        if (this.currentLine + 1 == this.storyInfo.content.length) {
          console.log("End chapter");

          this.nextChapter();

          return;
        }
        this.startSpeakLine(this.currentLine + 1);
      } else {
        this.currentLine++;

        this.currentAudio =
          this.currentAudio == "audio" ? "audioAnother" : "audio";

        if (this.currentLine == this.storyInfo.content.length) {
          console.log("End chapter");

          this.nextChapter();

          return;
        }
      }
      console.log("Next: " + this.currentLine);

      this.speak();
    },

    nextChapter: function() {
      if (this.chapters.length == 0) {
        this.showToast({
          type: "info",
          text: "Chương cuối!",
        });

        this.loadingNewChapter = false;
        return;
      }
      let index = this.getIndex();

      if (index != this.chapters.length - 1) {
        this.chapterId = this.chapters[index + 1].chapterId;
        this.chapter_url = this.chapters[index + 1].href;

        if (this.loadingNewChapter) return;

        this.loadingNewChapter = true;

        this.loadContent();
      } else {
        this.showToast({
          type: "info",
          text: "Chương cuối!",
        });
      }
      console.log(this.chapterId, index);
    },
    prevChapter: function() {
      this.loadingNewChapter = true;

      if (this.chapters.length == 0) {
        this.showToast({
          type: "info",
          text: "Chương cuối!",
        });

        this.loadingNewChapter = false;
        return;
      }
      let index = this.getIndex();

      if (index != 0) {
        this.chapterId = this.chapters[index - 1].chapterId;
        this.chapter_url = this.chapters[index - 1].href;

        this.loadContent();
      } else {
        this.showToast({
          type: "info",
          text: "Chương đầu tiên. Không thể trở về!",
        });
      }
      console.log(this.chapterId, index);
    },
    scrollText: function() {
      let objDiv = document.getElementById(`js-line-${this.currentLine}`);
      if (!objDiv) return;

      $(document.body).animate(
        {
          scrollTop: objDiv.offsetTop,
        },
        100
      );
    },
    scrollToTop: function(onlyTop) {
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
    scrollTo: function(num) {
      let offset = document.body.scrollTop + num;

      $(document.body).animate(
        {
          scrollTop: offset,
        },
        100
      );
    },
    getChapters: function(chaps) {
      this.chapters = chaps;
    },
    getIndex: function() {
      return this.chapters.findIndex((it) => it.chapterId == this.chapterId);
    },
    checkNumber: function($event) {
      return $event.keyCode >= 48 && $event.keyCode <= 57;
    },
    checkMax: function() {
      let timerInput = document.getElementById("countdown-timer-input");
      let num = Number(timerInput.value);

      if (num > 720) {
        timerInput.value = 720;
      }
    },
    startCountDownTimer: function() {
      let timerInput = document.getElementById("countdown-timer-input");
      let num = Number(timerInput.value);

      if (num == 0) {
        this.showToast({
          type: "warning",
          text: "Xin hãy nhập số phút lớn hơn 0!",
        });
        return;
      }

      this.dialogTimer = false;

      this.showCountDownTimer(Date.now() + num * 60 * 1000);
    },
    showCountDownTimer: function(time) {
      let that = this;

      that.showTimer = true;

      this.countDown = new Countdown({
        cont: document.querySelector(".countdown-timer-chapter"),
        date: time,
        outputTranslation: {
          hour: "",
          minute: "",
          second: "",
        },
        endCallback: function() {
          that.showTimer = false;

          that.startSpeak(false);

          that.showToast({
            type: "error",
            text: "Hết giờ!",
          });
        },
        outputFormat: "hour|minute|second",
      });

      this.countDown.start();
    },
  },
  mounted() {
    console.log("Mounted");

    this.audio = document.getElementById("speech-audio");
    this.audioAnother = document.getElementById("speech-audio-another");

    this.updateAudioConfig();

    document.body.addEventListener("scroll", () => {
      this.scrollTop = document.body.scrollTop < this.currentScrollPoint;

      this.currentScrollPoint = document.body.scrollTop;
    });

    window.addEventListener("keyup", (event) => {
      if (event.keyCode == 37) {
        this.prevChapter();
      }
      if (event.keyCode == 39) {
        this.nextChapter();
      }

      if (event.keyCode == 38) {
        this.scrollTo(-240);
      }
      if (event.keyCode == 40) {
        this.scrollTo(240);
      }
    });
  },
  destroyed() {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.audioAnother.pause();
    this.audioAnother.currentTime = 0;
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: #4f9bd2;
}

.chapter .chapter-content p {
  font-size: inherit;
  color: #dfdfdf;
  cursor: pointer;
}

.chapter .chapter-content p.active {
  background: #2e638a;
  color: #fff;
  user-select: none;
}
</style>
