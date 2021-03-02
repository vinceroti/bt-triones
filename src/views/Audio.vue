<template>
  <div class="audio-container">
    <p>Select color from home page before using this feature</p>
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
    if (this.ac) this.ac.close();
    this.lights = false;
    cancelAnimationFrame(this.ac);
  },
  methods: {
    alert() {
      alert("No microphone detected or access to microphone is restricted");
    },
    async setAudio() {
      try {
        this.media = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
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
    },
    click() {
      this.lights = !this.lights;
      if (this.lights) {
        this.write();
      }
    },
    write: async function () {
      const m = this.value / 100;
      const r = this.color[0] * m;
      const g = this.color[1] * m;
      const b = this.color[2] * m;
      const buff = Buffer.from([0x56, r, g, b, 0x00, 0xf0, 0xaa]);
      try {
        const res = await window.char.writeValue(buff);
        console.log(res);
        this.callback();
      } catch (e) {
        this.callback(e);
      }
    },
    callback(e) {
      if (e) return console.error(e);
      if (this.lights) this.write();
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
