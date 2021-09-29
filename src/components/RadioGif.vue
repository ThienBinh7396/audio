<template>
  <div
    class="loadingio-spinner-radio-58ei1kqbik2"
    :style="{ width: `${width}px`, height: `${width}px` }"
  >
    <div class="ldio-5sy8jw7bds" :style="{ transform: getScale() }">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "20",
    },
  },
  methods: {
    getScale: function() {
      return `scale(${Number(this.width) / 200})`;
    },
  },
};
</script>
