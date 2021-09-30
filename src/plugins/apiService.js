import Vue from "vue";
import Axios from "axios";

console.log(process.env.NODE_ENV)

Vue.prototype.$axios = Axios.create({
  // baseURL: 'https://my-audio1.herokuapp.com/api/'
  baseURL: "http://localhost:7000/api/",
});
