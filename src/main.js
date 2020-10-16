import App from "./App.vue";
import Vue from "vue";
import store from "./store/index";
import router from "./router";

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
