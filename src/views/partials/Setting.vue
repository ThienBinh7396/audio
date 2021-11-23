<template>
  <v-layout>
    <div class="tb-dialog" :class="{ show: dialogSetting }" v-if="!loading">
      <div class="tb-dialog-overplay" @click="dialogSetting = false" />
      <v-card class="dialog-setting-content">
        <v-card-title class="px-3 py-2 text-blur">Cấu Hình: </v-card-title>
        <user-config-dialog class="px-3" />
      </v-card>
    </div>

    <div class="tb-dialog" :class="{ show: dialogTimer }" v-if="!loading">
      <div class="tb-dialog-overplay" @click="dialogTimer = false" />
      <v-card class="dialog-setting-content" dark>
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
          @click.stop="$emit('speak')"
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
        <v-btn color="#ff0000" small dark fab @click.stop="dialogTimer = true">
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
          @click.stop="$emit('startSpeak')"
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
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    reading: Boolean,
  },
  components: {
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
      loading: false,
      voice: "Vietnamese Female",
      scrollTop: false,
      currentScrollPoint: 0,
    };
  },
  computed: {
    ...mapState("app", ["audioConfig", "detectMobile"]),
  },
  mounted() {
    document.body.addEventListener("scroll", () => {
      this.scrollTop = document.body.scrollTop < this.currentScrollPoint;

      this.currentScrollPoint = document.body.scrollTop;
    });
  },
  methods: {
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
    checkMax: function() {
      let timerInput = document.getElementById("countdown-timer-input");
      let num = Number(timerInput.value);

      if (num > 720) {
        timerInput.value = 720;
      }
    },
    checkNumber: function($event) {
      return $event.keyCode >= 48 && $event.keyCode <= 57;
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
};
</script>

<style></style>
