<template>
  <div class="tb-content">
    <toast />
    <preload-page />

    <div v-show="!preload">
      <div
        class="header-background"
        :style="{ 'background-image': `url('${topBackground}')` }"
      />

      <v-container class="main-container">
        <div class="top-header position-relative">
          <ul class="top-nav" v-if="isShowNav">
            <li v-for="(item, index) in nav" :key="`nav-${index}`">
              <router-link
                v-bind:to="item.path"
                class="to-link"
                :class="{ disabled: index == nav.length - 1 }"
              >
                {{ item.text }}
              </router-link>
              <v-icon size="15" v-if="index < nav.length - 1"
                >mdi-chevron-right</v-icon
              >
            </li>
          </ul>
          <v-btn
            fab
            x-small
            color="#000000b3"
            v-if="!detectMobile"
            class="top-search"
            @click="controlShowSearch(true)"
          >
            <v-icon size="17">mdi-magnify</v-icon>
          </v-btn>
        </div>
        <div class="tb-dialog" :class="{ show: showSearch }">
          <div class="tb-dialog-overplay" @click="controlShowSearch(false)" />
          <v-card class="dialog-search-content">
            <search-partial />
          </v-card>
        </div>
        <div id="main-content">
          <transition
            name="list"
            mode="out-in"
            @beforeLeave="beforeLeave"
            @enter="enter"
            @afterEnter="afterEnter"
          >
            <router-view />
          </transition>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    PreloadPage: () => import("@/views/partials/PreloadPage"),
    SearchPartial: () => import("@/views/partials/SearchPartial"),
  },
  data() {
    return {
      preload: true,
    };
  },
  watch: {
    title: function(val) {
      document.title = val;
    },
  },
  computed: {
    ...mapState("app", [
      "topBackground",
      "nav",
      "isShowNav",
      "title",
      "showSearch",
      "detectMobile",
    ]),
  },
  methods: {
    ...mapMutations("app", ["setNav", "setDetectMobile", "setShowSearch"]),
    ...mapActions("app", ["updateResponsiveByWidth"]),
    onResponsiveInverted() {
      this.updateResponsiveByWidth(window.innerWidth);

      this.setDetectMobile(this.detectMb());
    },
    detectMb: function() {
      var check = false;
      (function(a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    checkHttp: function() {
      if (/^http:\/\/[^localhost]/.test(location.href)) {
        location.href = location.href.replace("http://", "https://");
      }
    },
    controlShowSearch: function(bool) {
      this.setShowSearch(bool);
    },
  },
  created() {
    setTimeout(() => {
      this.preload = false;
    }, 500);

    this.checkHttp();
  },
  mounted() {
    this.onResponsiveInverted();

    window.addEventListener("resize", this.onResponsiveInverted);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
};
</script>

<style></style>
