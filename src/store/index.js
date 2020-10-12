import bt from "./bt";
import { createStore } from "vuex";
import { createSharedMutations } from "vuex-electron";

export default createStore({
  modules: {
    bt,
  },
  plugins: [createSharedMutations()],
});
