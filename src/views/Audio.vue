<template>
  <div class="audio-container">
    <av-media
      v-if="micPerm"
      :media="media"
      type="frequ"
      line-color="#00AAFF"
      :radius="4"
      :canv-height="200"
      :frequ-lnum="sliderValue"
    />
    <meter max="100" :value="value"></meter>
    <vue-slider v-model="sliderValue" /> Intensity Slider -
    {{ Math.round(value) }}
  </div>
</template>

<script>
import Vue from "vue";
import VueMedia from "vue-audio-visual";
import { mapGetters } from "vuex";

Vue.use(VueMedia);
export default {
  data() {
    return {
      media: null,
      value: 0,
      ac: null,
      an: null,
      sliderValue: 50,
    };
  },
  computed: {
    ...mapGetters({ micPerm: "audio/micPermission" }),
  },
  async mounted() {
    if (!this.micPerm) return this.alert();
    await this.setAudio();
    this.audioDb();
  },
  beforeDestroy() {
    if (this.ac) this.ac.suspend();
    cancelAnimationFrame(this.ac);
  },
  methods: {
    alert() {
      alert(
        "macOS 10.14 Mojave or higher requires consent for microphone access. Please allow this app to access your Microphone in Security & Privacy within system preferences to use this feature"
      );
    },
    async setAudio() {
      try {
        navigator.getUserMedia =
          navigator.getUserMedia || navigator.webkitGetUserMedia;
        const media = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.media = media;
      } catch (e) {
        console.error(e);
      }
    },
    audioDb() {
      const ac = new AudioContext();
      this.ac = ac;
      this.an = ac.createAnalyser();
      const source = ac.createMediaStreamSource(this.media);
      source.connect(this.an);
      requestAnimationFrame(this.freqLoop);
    },
    freqLoop() {
      const an = this.an;
      const freqs = new Uint8Array(an.frequencyBinCount);
      const times = new Uint8Array(an.frequencyBinCount);
      an.smoothingTimeConstant = 0.8;
      an.getByteFrequencyData(freqs);
      an.getByteTimeDomainData(times);

      //set average number freq data to meter value, might not be a great solution but works for now

      let total = 0;
      for (let i = 0; i < freqs.length; i++) total += freqs[i];
      const avg = total / freqs.length;
      this.value = avg * (this.sliderValue * 0.02);
      if (!this._isDestroyed) requestAnimationFrame(this.freqLoop);
    },
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
.audio-container {
  margin-top: spacing(section);
  text-align: center;
}
meter {
  width: 100%;
}
</style>
<style lang="scss"></style>
