<template>
  <div id="app">
    <header>
      <status-bar />
      <div class="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/audio">Audio</router-link>
      </div>
    </header>
    <main v-if="btConnected" class="container">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
import StatusBar from "./components/StatusBar.vue";
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {
    StatusBar,
  },
  computed: {
    ...mapGetters({ btConnected: "bt/connected", deviceId: "bt/deviceId" }),
  },
};
</script>

<style lang="scss">
@import "./assets/scss/_index.scss";

.nav {
  text-align: center;
}
</style>
