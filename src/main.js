import App from "./App.vue";
import Vue from "vue";
import store from "./store/index";

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
