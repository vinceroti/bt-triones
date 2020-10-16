<template>
  <div>
    <audio ref="player" controls />
    <av-media :media="media" />
  </div>
</template>

<script>
import Vue from "vue";
import VueMedia from "vue-audio-visual";

Vue.use(VueMedia);
export default {
  data() {
    return {
      media: null,
    };
  },
  async mounted() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log(media);
      this.media = media;
      this.$refs.player.srcObject = media;
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
<style lang="scss" scoped>
.on-off {
  display: flex;
  justify-content: center;
  margin-bottom: spacing(paragraph);
  button {
    margin: spacing(element);
  }
}
.vue-slider {
  margin-bottom: spacing(base);
}
</style>
<style lang="scss"></style>
