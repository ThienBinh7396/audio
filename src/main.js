import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/components";
import "./plugins/apiService";
import "./plugins/helpers/image";

import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import "hooper/dist/hooper.css";
import "@/assets/css/main/main.scss";
import "@/assets/css/loading.css";
import "@/assets/css/animation.css";

import router from "./router";

import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
