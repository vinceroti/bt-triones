<template>
  <div id="app">
    <header>
      <status-bar />
      <ul class="nav">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/audio">Audio</router-link></li>
      </ul>
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
  name: "App",
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
  display: flex;
  justify-content: center;
  li {
    margin: spacing(element) 0;
    &::after {
      content: "";
      margin: 0 5px;
      border-right: 1px solid;
    }
    &:last-child {
      &::after {
        border: 0;
        margin: 0;
      }
    }
  }
}
</style>
