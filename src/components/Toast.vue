<template>
  <v-snackbar v-model="snackbar">
    <v-layout>
      <v-flex class="body-1 d-flex align-center">
          {{ toast.text }}
      </v-flex>
      <v-btn :color="getColor()" text @click="snackbar = false"> Close </v-btn>
    </v-layout>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      color: "green",
      text: "123131",
      snackbar: false,
    };
  },
  computed: {
    ...mapState("app", ["showToast", "toast"]),
  },
  watch: {
    showToast: function (val) {
      this.snackbar = true;
    },
  },
  created() {},
  methods: {
    getColor: function () {
      switch (this.toast.type) {
        case "success":
          return "#4caf50";
        case "info":
          return "#4D96CB";
        case "error":
          return "#ff5252";
        case "warning":
          return "#f44336";
      }
    },
  },
};
</script>

<style>
.v-snack__content {
  padding: 8px 4px 8px 16px;
}
</style>
