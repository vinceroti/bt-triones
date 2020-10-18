import bt from "./bt";
import audio from "./audio";
import { createSharedMutations } from "vuex-electron";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bt,
    audio,
  },
  plugins: [createSharedMutations()],
});
