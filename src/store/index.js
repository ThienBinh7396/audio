// Lib imports
import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";

// Store functionality
import modules from "./modules";

Vue.use(Vuex);

// Create a new store
const store = new Vuex.Store({
  modules,
  plugins: [createPersistedState()],
});

export default store;
