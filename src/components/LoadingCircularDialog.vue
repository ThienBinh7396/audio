<template>
  <transition name="scale" mode="in-out">
    <div
      class="tb-dialog-circular"
      :class="{ mobile: detectMobile }"
      v-if="show"
    >
      <loading-icon w="82" class="mx-auto" color="#1d191a" />
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState("app", ["detectMobile"]),
  },
};
</script>
