import Vue from "vue";
import Vuex from "vuex";
import bt from "./bt";
import { createPersistedState, createSharedMutations } from "vuex-electron";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState(), createSharedMutations()],
  modules: {
    bt,
  },
});
