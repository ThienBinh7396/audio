import Vue from "vue";
import PerfectScrollbar from "vue2-perfect-scrollbar";

Vue.component("Toast", () => import("@/components/Toast"));

Vue.component("LoadingIcon", () => import("@/components/LoadingIcon"));

Vue.component("RadioGif", () => import("@/components/RadioGif"));

Vue.component("LoadingCircularDialog", () =>
  import("@/components/LoadingCircularDialog")
);

Vue.use(PerfectScrollbar);
