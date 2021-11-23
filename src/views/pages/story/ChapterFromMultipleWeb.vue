<template>
  <div class="pa-4">
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

    <setting :reading="reading" @startSpeak="startSpeak" />

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
        :style="{ 'font-size': `${audioConfig.fontSize}px` }"
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
      currentScrollPoint: 0,
      scrollTop: 0,
      audio: null,
      audioCountError: 0,
      audioAnother: null,
      audioAnotherCountError: 0,
      currentAudio: "audio",
      currentLine: 0,
      voice: "Vietnamese Female",
    };
  },
  computed: {
    ...mapState("app", ["audioConfig", "recentStory", "testUrl"]),
  },
  mounted() {
    if (
      this.recentStory &&
      this.recentStory.data &&
      this.recentStory.data.content
    ) {
      this.url = this.recentStory.data.currentChapter;
    }

    console.log("Mounted");

    this.audio = document.getElementById("speech-audio");
    this.audioAnother = document.getElementById("speech-audio-another");

    document.body.addEventListener("scroll", () => {
      this.scrollTop = document.body.scrollTop < this.currentScrollPoint;

      this.currentScrollPoint = document.body.scrollTop;
    });

    window.addEventListener("keyup", (event) => {
      if (event.keyCode == 37) {
        this.navigateChapter(false);
      }
      if (event.keyCode == 39) {
        this.navigateChapter();
      }

      if (event.keyCode == 38) {
        this.scrollTo(-240);
      }
      if (event.keyCode == 40) {
        this.scrollTo(240);
      }
    });
  },
  methods: {
    ...mapMutations("app", ["setAudioConfig", "setRecentStory", "setTestURL"]),
    ...mapActions("app", ["showToast"]),
    gotoChapter() {
      this.loading = true;
      this.$axios
        .post("/story/fetchContentByUrl", {
          chapter_url: this.url,
        })
        .then((res) => {
          const {
            data: { data, type, message },
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
                content: data.content.split("\n").filter((it) => it),
                type: "success",
              },
            });

            this.setTestURL({
              ...this.testUrl,
              [data.website]: this.url,
            });
          }

          this.loading = false;
          this.currentLine = 0;
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
    getUrl: function(index) {
      console.log("Index: ", index, this.recentStory);

      if (
        !this.recentStory ||
        !this.recentStory.data ||
        !this.recentStory.data.content ||
        this.recentStory.data.content.length <= index
      )
        return;

      let text = encodeURI(this.recentStory.data.content[index]);

      console.log(this.recentStory.data.content[index]);

      // if (text[text.length - 1] == '.') {
      //     text = text.substring(0, text.length - 1)
      // }

      return `https://code.responsivevoice.org/getvoice.php?text=${text}&lang=vi&engie=g1&rate=0.53&key=32hDX4HJ&volume=1&gender=female`;
      //return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${text}&lang=vi&engine=g1&rate=0.53&volume=1&key=32hDX4HJ&gender=female`
    },
    getUrlWithText: function(text) {
      return `https://code.responsivevoice.org/getvoice.php?text=${text}&lang=vi&engie=g1&rate=0.53&key=32hDX4HJ&volume=1&gender=female`;
      //return `https://texttospeech.responsivevoice.org/v1/text:synthesize?text=${text}&lang=vi&engine=g1&rate: 0.53&volume=1&key=32hDX4HJ&gender=female`
    },
    play: function(ref) {
      this.updateAudioConfig();
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
    getIndex: function() {
      return this.chapters.findIndex((it) => it.chapterId == this.chapter_id);
    },
    ended: function() {
      if (
        this.currentLine ==
        this.recentStory.data.content.length - 1
        // && this.getIndex() != this.chapters.length - 1
      ) {
        responsiveVoice.speak(
          // `Chương tiếp! ${this.chapters[this.getIndex() + 1].title}}`,
          `Kết thúc chương! ${this.recentStory.data.chapterTitle}. Load chương tiếp`,
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

        if (this.currentLine == this.recentStory.data.content.length) {
          console.log("End chapter");

          this.nextChapter();

          return;
        }
      }
      console.log("Next: " + this.currentLine);

      this.speak();
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
      console.log(speak, this.reading, this.currentLine);
    },
    speak: function() {
      if (
        !this.recentStory ||
        !this.recentStory.data ||
        !this.recentStory.data.content
      )
        return;

      let a = this.currentAudio == "audio" ? "audioAnother" : "audio";

      this[a].src =
        this.currentLine == this.recentStory.data.content.length - 1
          ? "/audio/temp-audio.mp3"
          : this.getUrl(this.currentLine + 1);

      this[a].load();

      //console.log(this[a]);

      this[this.currentAudio].play();

      this.scrollText();
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
  },
  destroyed() {
    try {
      this.audio.pause();
      this.audio.currentTime = 0;

      this.audioAnother.pause();
      this.audioAnother.currentTime = 0;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
