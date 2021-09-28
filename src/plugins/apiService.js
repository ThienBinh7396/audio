import Vue from "vue";
import Axios from "axios";

Vue.prototype.$axios = Axios.create({
  // baseURL: 'https://my-audio1.herokuapp.com/api/'
  baseURL: "http://localhost:7000/api/",
  // baseURL: '/api/'
  //baseURL: 'https://planet-case.glitch.me/api/'
  //baseURL: 'https://brindle-macadamia.glitch.me/api/'
});
