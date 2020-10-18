import App from "./App.vue";
import Vue from "vue";
import store from "./store/index";
import router from "./router";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

Vue.component("VueSlider", VueSlider);

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
