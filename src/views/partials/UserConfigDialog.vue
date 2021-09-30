<template>
  <div v-if="tempConfig">
    <v-slider
      v-model="tempConfig.volume"
      min="0"
      max="1"
      ticks
      thumb-label
      step="0.1"
      prepend-icon="mdi-volume-medium"
      @change="configChange()"
      @click:append="volumeUp(true)"
      @click:prepend="volumeUp(false)"
    >
      <template v-slot:append>
        <div style="width: 24px" class="text-center">
          {{ tempConfig.volume }}
        </div>
      </template>
    </v-slider>
    <v-slider
      v-model="tempConfig.fontSize"
      min="20"
      max="36"
      ticks
      thumb-label
      step="2"
      prepend-icon="mdi-format-color-text"
      @change="configChange()"
      @click:prepend="fontSizeUp(false)"
    >
      <template v-slot:append>
        <div style="width: 24px" class="text-center">
          {{ tempConfig.fontSize }}
        </div>
      </template>
    </v-slider>
    <v-slider
      v-model="tempConfig.speed"
      min="0.5"
      max="3"
      ticks
      tick-size="2"
      thumb-label
      step="0.1"
      append-icon="12"
      prepend-icon="mdi-speedometer-slow"
      @change="configChange()"
      @click:prepend="fontSizeUp(false)"
    >
      <template v-slot:append>
        <div style="width: 24px" class="text-center">
          {{ tempConfig.speed }}
        </div>
      </template>
    </v-slider>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      tempConfig: null,
    };
  },
  computed: {
    ...mapState("app", ["audioConfig"]),
  },
  watch: {
    audioConfig: function(val) {
      if (this.tempConfig) {
        let { volume, fontSize, speed } = val;

        this.tempConfig = {
          volume,
          fontSize,
          speed,
        };
      }
    },
  },
  methods: {
    ...mapActions("app", ["updateConfig"]),
    volumeUp: function(up) {
      console.log(this.tempConfig.volume);
      if (up) {
        this.tempConfig.volume += 0.1;
      } else {
        this.tempConfig.volume -= 0.1;
      }

      if (this.tempConfig.volume < 0) this.tempConfig.volume = 0;
      if (this.tempConfig.volume > 1) this.tempConfig.volume = 1;

      this.configChange();
    },
    fontSizeUp: function(up) {
      if (up) {
        this.tempConfig.fontSize += 2;
      } else {
        this.tempConfig.fontSize -= 2;
      }

      if (this.tempConfig.fontSize < 20) this.tempConfig.fontSize = 20;
      if (this.tempConfig.fontSize > 36) this.tempConfig.fontSize = 36;

      this.configChange();
    },
    configChange: function() {
      this.updateConfig(this.tempConfig);
    },
  },
  mounted() {
    this.tempConfig = _.cloneDeep(this.audioConfig);
  },
};
</script>
