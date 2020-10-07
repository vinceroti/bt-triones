<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Main msg="Welcome to Your Vue.js App" />
</template>

<script>
import devtools from "@vue/devtools";
import Main from "./components/Main.vue";

if (process.env.NODE_ENV === "development") devtools.connect();

export default {
  name: "app",
  components: {
    Main,
  },
};
</script>

<style lang="scss">
@import "./assets/scss/_index.scss";
</style>
