import Vue from "vue";

Vue.prototype.getTtvWebImageUrl = (params) => {
  return `https://www.nae.vn/ttv/ttv/public/images/story/${params}.jpg`;
};
