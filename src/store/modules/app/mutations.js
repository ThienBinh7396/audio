import { set, toggle } from "@/utils/vuex";

export default {
  setConfig: set("config"),
  setTestURL: set("testUrl"),
  setRecentStory: set("recentStory"),
  setRecentStories: set("recentStories"),
  setResponsive: set("responsive"),
  setDetectMobile: set("detectMobile"),
  setShowSearch: set("showSearch"),
  setNav: set("nav"),
  setShowNav: set("isShowNav"),
  setTopBackground: set("topBackground"),
  setTitle: set("title"),
  setShowToast: (state, value) => {
    console.log(value);
    state.showToast = value;
  },
  setToast: set("toast"),
  setIp: set("ip"),
  setTimer: set("timer"),
};
