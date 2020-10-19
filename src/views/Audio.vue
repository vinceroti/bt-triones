<template>
  <div class="audio-container">
    <av-media
      v-if="micPerm"
      :media="media"
      type="frequ"
      line-color="#00AAFF"
      :canv-height="200"
      :frequ-lnum="sliderValue"
    />
    <meter max="100" :value="value"></meter>
    <div>
      <vue-slider v-model="sliderValue" /> Intensity Slider -
      {{ Math.round(value) }}
    </div>
    <button class="button-link" :class="{ lights }" @click="click">
      {{ lights ? "Disconnect" : "Connect" }}
    </button>
  </div>
</template>

<script>
import Vue from "vue";
import VueMedia from "vue-audio-visual";
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";

Vue.use(VueMedia);
export default {
  data() {
    return {
      media: null,
      value: 0,
      ac: null,
      an: null,
      sliderValue: 50,
      lights: false,
    };
  },
  computed: {
    ...mapGetters({ micPerm: "audio/micPermission", color: "bt/color" }),
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
      let avg = total / freqs.length;
      avg = avg * (this.sliderValue * 0.02);
      avg = avg > 100 ? 100 : avg;
      this.value = avg;
      if (!this._isDestroyed) requestAnimationFrame(this.freqLoop);
      if (this.lights) this.write();
    },
    click() {
      this.lights = !this.lights;
    },
    write: debounce(function () {
      const m = this.value / 100;
      const r = this.color[0] * m;
      const g = this.color[1] * m;
      const b = this.color[2] * m;
      const buff = Buffer.from([0x56, r, g, b, 0x00, 0xf0, 0xaa]);
      window.char.write(buff, true, this.callback);
    }, 2),
    callback(e) {
      if (e) console.error(e);
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
.lights {
  font-weight: font-weight(commissioner-bold);
}
</style>
<style lang="scss"></style>
