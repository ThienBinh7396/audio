import Vue from "vue";
import Axios from "axios";

import { ENVIRONMENT } from "@/constants/constants"

const API_BASE_URL = process.env.NODE_ENV === ENVIRONMENT.PRODUCTION ? 'https://my-audio1.herokuapp.com/api/' : "http://localhost:7000/api/"

Vue.prototype.$axios = Axios.create({
  baseURL: API_BASE_URL,
});
